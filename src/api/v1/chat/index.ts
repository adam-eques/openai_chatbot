import express, { NextFunction, Request, Response } from 'express';
import { loadOpenAI, loadOpenAIAssistant, prisma } from '../../../utils';

const router = express.Router();

// To store chat sessions
let threadByUser = {};

router.route('/').post(async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY || "", process.env.OPENAI_ASSISTANT_ID || "")
  const openai = loadOpenAI(process.env.OPENAI_API_KEY);
  const userId = req.body.userId;

  if (!threadByUser[userId]) {
    try {
      const myThread = await openai.beta.threads.create({
        metadata: {
          assistantId: assistant.id,
        }
      });
      console.log("New thread was created by id: ", userId, "\n");
      threadByUser[userId] = myThread.id;
      await prisma.threads.create({
        data: {
          assistantId: assistant.id,
          threadId: myThread.id,
        }
      })
    } catch (error) {
      console.error("Error creating thread", error)
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }
  const userMessage = req.body.message;

  // Add a message to the thread
  try {
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
        tools: [
          { type: "retrieval" }, // Retrieval tool
        ],
      }
    );

    console.log("This is the run object: ", myRun, "\n");

    // Periodically retrieve the Run to check on its status
    const retrieveRun = async () => {
      let keepRetrievingRun;

      while (myRun.status !== "completed") {
        keepRetrievingRun = await openai.beta.threads.runs.retrieve(
          threadByUser[userId], // Use the stored thread ID for this user
          myRun.id
        );

        console.log(`Run status: ${keepRetrievingRun.status}`);

        if (keepRetrievingRun.status === "completed") {
          console.log("\n");
          break;
        }
      }
    };
    // Retrieve the Messages added by the Assistant to the Thread
    const waitForAssistantMessage = async () => {
      await retrieveRun();

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
    res.status(500).json({ error: "Internal server error" });
  }
  return;
})

export default router;