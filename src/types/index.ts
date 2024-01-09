
export interface ChatLeadInfo {
  threadId: string,
  name: string,
  email: string,
}

export interface CacheValue extends ChatLeadInfo {
  clientId: number,
  createdAt: Date,
}

export interface AirtableValue extends ChatLeadInfo {
  createdAt: Date,
  chatHistory: string,
}