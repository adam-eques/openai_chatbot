import OpenAI from 'openai';
import prismaClient from './prisma';

export const loadOpenAI = (openai_apikey: string) => {
  const openai = new OpenAI({
    apiKey: openai_apikey
  });
  return openai;
}

export const loadOpenAIAssistant = async (openai_apikey: string, assistant_id: string) => {
  const openai = new OpenAI({
    apiKey: openai_apikey
  });
  let assistants = (await openai.beta.assistants.list()).data.filter((value) => value.id === assistant_id)
  if (assistants.length > 0) return assistants[0]
  else {
    let assistant = await openai.beta.assistants.create({
      name: "chatbot_beta",
      instructions: "",
      tools: [{ type: "retrieval" }, { type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    })
    return assistant
  }
}

export const prisma = prismaClient;

// export const assistant = await openai.beta.assistants.create({
//   name: "chatbot_beta",
//   instructions: "",
//   tools: [{ type: "retrieval" }],
//   model: "gpt-4-1106-preview",
// })
