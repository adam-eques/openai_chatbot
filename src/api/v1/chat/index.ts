import express, { NextFunction, Request, Response } from 'express';
import { checkClientBody, checkUserIdBody } from '../../../middleware/checkParam';
import { loadOpenAI, loadOpenAIAssistant, prisma } from '../../../utils';
import { callMockAPI } from '../../../utils/mockapi';
import { wait } from '../../../utils/time';

const router = express.Router();

// To store chat sessions
let threadByUser = {};

router.route('/').post(checkClientBody, checkUserIdBody, async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const openai = loadOpenAI(process.env.OPENAI_API_KEY);
    const userId = req.body.userId;
    const clientName = req.body.client;

    const client = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    })

    console.log("client", client)
    if (client === null || typeof client === "undefined") {
      res.status(404).json({ error: "No such client" });
      return;
    }

    const assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY || "", client.assistantId);
    console.log(assistant)
    if (assistant.id !== client.assistantId) {
      prisma.client.update({
        where: {
          id: client.id
        },
        data: {
          assistantId: assistant.id
        }
      })
    }

    if (!threadByUser[userId]) {
      const myThread = await openai.beta.threads.create({
        metadata: {
          assistantId: assistant.id,
        }
      });
      console.log("New thread was created by id: ", userId, "\n");
      threadByUser[userId] = myThread.id;
      await prisma.thread.create({
        data: {
          threadId: myThread.id,
          clientId: client.id,
        }
      })
    }
    const userMessage = req.body.message;

    // Add a message to the thread
    const myThreadMessage = await openai.beta.threads.messages.create(
      threadByUser[userId],
      {
        role: "user",
        content: userMessage,
      }
    );
    // Run the Assistant
    const myRun = await openai.beta.threads.runs.create(
      threadByUser[userId], // Use the stored thread ID for this user
      {
        assistant_id: assistant.id,
        instructions: assistant.instructions, // Your instructions here
        tools: assistant.tools,
      }
    );

    console.log("This is the run object: ", myRun, "\n");

    // Periodically retrieve the Run to check on its status
    const retrieveRun = async () => {
      const run_id = myRun.id
      const thread_id = threadByUser[userId]

      let flagFinish = false

      let MAX_COUNT = 2 * 600 // 120s 
      let TIME_DELAY = 100 // 100ms
      let count = 0

      do {
        console.log(`Loop: ${count}`)
        const run_data = await openai.beta.threads.runs.retrieve(
          thread_id, // Use the stored thread ID for this user
          run_id,
        )

        const status = run_data.status

        console.log(`Status: ${status} ${(new Date()).toLocaleTimeString()}`)

        switch (status) {
          case 'completed':
            flagFinish = true
            break;

          case 'requires_action':
            console.log('run-data', run_data)

            const required_action = run_data.required_action
            const required_tools = required_action.submit_tool_outputs.tool_calls

            console.log('required-action', required_action)
            console.log('required-tools', required_tools)

            let tool_output_items = []

            for (let rtool of required_tools) {

              const function_name = rtool.function.name
              const tool_args = JSON.parse(rtool.function.arguments)

              console.log("-", function_name, tool_args)

              let tool_output = callMockAPI(client.id, thread_id, function_name, tool_args)

              tool_output_items.push({
                tool_call_id: rtool.id,
                output: JSON.stringify(tool_output)
              })
            }

            console.log('tools-output', tool_output_items)

            const ret_tool = await openai.beta.threads.runs.submitToolOutputs(
              thread_id,
              run_id,
              {
                tool_outputs: tool_output_items,
              }
            )

            console.log('ret-tool', ret_tool)
            break;
          case 'expired':
          case 'cancelled':
          case 'failed':
            flagFinish = true
          default:
            break;
        }

        if (!flagFinish) {
          count++
          if (count >= MAX_COUNT) {
            flagFinish = true
          } else {
            await wait(TIME_DELAY)
          }
        }

      } while (!flagFinish)
    };

    // Retrieve the Messages added by the Assistant to the Thread
    const waitForAssistantMessage = async () => {
      await retrieveRun();
      // await extractLeadInfo();

      const allMessages = await openai.beta.threads.messages.list(
        threadByUser[userId] // Use the stored thread ID for this user
      );

      // Send the response back to the front end

      const message = allMessages.data[0].content[0]
      let response = ""
      if (message.type === 'text') {
        response = message.text.value
      }
      res.status(200).json({
        response: response,
      });
      console.log(
        "------------------------------------------------------------ \n"
      );

      console.log("User: ", myThreadMessage.content[0].type === "text" ? myThreadMessage.content[0].text.value : "");
      console.log("Assistant: ", allMessages.data[0].content[0].type === "text" ? allMessages.data[0].content[0].text.value : "");
    };
    waitForAssistantMessage();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json();
  }
})

export default router;