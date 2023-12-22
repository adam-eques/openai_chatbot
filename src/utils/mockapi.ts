import { setCache } from "./cache"
import { CustomError } from "./error"

const getNameMail = (clientId: number, threadId: string) => ({ name, email }: { name?: string, email?: string }) => {
  console.log(threadId, { name, email })
  setCache({ threadId, name, email }, clientId)
  return { name, email }
}

export function callMockAPI(clientId: number, threadId: string, function_name: string, function_args) {
  switch (function_name) {
    case 'get_name_mail':
      return getNameMail(clientId, threadId)(function_args)
    default:
      throw new CustomError('unknown function', 'function not found')
  }
}