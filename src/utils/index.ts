import OpenAI from 'openai';
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';
// import get_useremail from './fns/get_useremail.json';
// import get_username from './fns/get_username.json';
import crypto from 'crypto';
import get_name_mail from './fns/get_name_mail.json';
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
      tools: openaiAssistantTools,
      model: "gpt-4-1106-preview",
    })
    return assistant
  }
}

export function encrypt(text) {
  let key = Buffer.alloc(32);
  Buffer.from(process.env.OPENAI_API_KEY || "", 'utf8').copy(key);
  let iv = Buffer.alloc(16);
  Buffer.from(process.env.OPENAI_API_KEY || "", 'utf8').copy(iv);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encryptedText) {
  let key = Buffer.alloc(32);
  Buffer.from(process.env.OPENAI_API_KEY || "", 'utf8').copy(key);
  let iv = Buffer.alloc(16);
  Buffer.from(process.env.OPENAI_API_KEY || "", 'utf8').copy(iv);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const isExpired = (timestr: string) => {
  try {
    if ((new Date(decrypt(timestr))).getTime() > Date.now()) {
      return false
    }
  } catch (error) {
  }
  return true
}

export const openaiAssistantTools: Array<
  | AssistantCreateParams.AssistantToolsCode
  | AssistantCreateParams.AssistantToolsRetrieval
  | AssistantCreateParams.AssistantToolsFunction
> = [
    { type: "retrieval" },
    { type: "code_interpreter" },
    // { type: "function", function: get_username },
    // { type: "function", function: get_useremail },
    { type: "function", function: get_name_mail },
  ]

export const prisma = prismaClient;

// export const assistant = await openai.beta.assistants.create({
//   name: "chatbot_beta",
//   instructions: "",
//   tools: [{ type: "retrieval" }],
//   model: "gpt-4-1106-preview",
// })
