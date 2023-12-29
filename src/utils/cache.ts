import { caching } from 'cache-manager';
import { AirtableValue, CacheValue, ChatLeadInfo } from '../types';

import config from '../config';

export const cache = caching({
  store: 'memory',
  ttl: config.MAX_TTL /*milliseconds*/,
})

export const setCache = async (value: ChatLeadInfo, clientId: number) => {
  const saved: CacheValue = await cache.get(value.threadId)
  console.log("saved", saved)
  let newToSave: CacheValue
  console.log("newToSave", newToSave)
  const createdAt = new Date()
  if (typeof saved === 'object') {
    newToSave = {
      ...saved,
      clientId: clientId,
      createdAt: createdAt,
    }
  }
  newToSave = {
    ...value,
    createdAt: createdAt,
    clientId: clientId,
  }
  console.log("newToSave", newToSave)
  await cache.set(value.threadId, newToSave)
}

export const flushOldCache = async (timeStd: number): Promise<Record<string, AirtableValue[]>> => {
  const keys: string[] = await cache.store.keys()
  const timestamp = Date.now()
  const keysToDel: Array<string> = []
  const oldValues: Array<CacheValue> = []
  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    const value: CacheValue = await cache.get(key)
    if ((timestamp - value.createdAt.getTime()) > timeStd) {
      oldValues.push(value)
      keysToDel.push(key)
    }
  }
  console.log("keysToDel", keysToDel)
  await cache.store.del(keysToDel)
  let ret: Record<string, AirtableValue[]> = {}
  oldValues.forEach((value) => {
    const clientId: string = value.clientId.toString()
    if (clientId) {
      if (typeof ret[clientId] !== 'object') {
        ret[clientId] = []
      }
      const { threadId, name, email, createdAt } = value
      ret[clientId] = [
        ...ret[clientId],
        { threadId, name, email, createdAt, chatHistory: `${process.env.BACKEND_API_URL}/v1/chathistory?threadId=${threadId}` }
      ]
    }
  })
  console.log("oldValues", oldValues)
  return ret
}