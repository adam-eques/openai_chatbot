import axios from "axios";
import { AirtableValue } from "../../types";

const AIRTABLE_API_V0 = "https://api.airtable.com/v0"

const atbApi = axios.create({
  baseURL: "https://api.airtable.com/v0",
  headers: {
    "Content-Type": "application/json"
  }
})

export const createTable = (token: string, baseId: string, tableName: string) => {
  return atbApi.post(`/meta/bases/${baseId}/tables`, {
    "description": "Lead generation info table from smart revoludtion chatbot",
    "fields": [
      {
        "description": "chat thread id from openai",
        "name": "threadId",
        "type": "singleLineText"
      },
      {
        "name": "name",
        "type": "singleLineText"
      },
      {
        "name": "email",
        "type": "email"
      },
      {
        "name": "createdAt",
        "options": {
          "timeZone": "client",
          "dateFormat": {
            "format": "YYYY-MM-DD",
            "name": "iso"
          },
          "timeFormat": {
            "name": "24hour",
            "format": "HH:mm"
          }
        },
        "type": "dateTime",
      },
      {
        "name": "chatHistory",
        "type": "url",
      }
    ],
    "name": tableName
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const insertRecords = (token: string, baseId: string, tableName: string, values: AirtableValue[]) => {
  let records = []
  values.forEach((value: AirtableValue) => {
    records.push({
      fields: value
    })
  })
  return atbApi.post(`/${baseId}/${tableName}`, {
    records
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}