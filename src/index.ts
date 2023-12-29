import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import api from './api';
import config from './config';
import { AirtableValue } from './types';
import { prisma } from './utils';
import { insertRecords } from './utils/airtables';
import { flushOldCache } from './utils/cache';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CACHE_FLUSH_INTERVAL = config.MAX_TTL * 0.5;

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'))


const router = express.Router()
router.use("/api", api)

app.use('/', router);

process.on("unhandledRejection", (err: Error) => {
  console.error(`Unhandled rejection: ${err}`, err.stack);
});


setInterval(async () => {
  try {
    const values: Record<string, AirtableValue[]> = await flushOldCache(CACHE_FLUSH_INTERVAL)
    console.log("flushed", values)


    const clientIds = Object.keys(values)
    for (let idx = 0; idx < clientIds.length; idx++) {
      try {
        const clientId = clientIds[idx];
        const client = await prisma.client.findFirst({
          where: {
            id: Number(clientId),
          }
        })

        const fields = values[clientId]
        insertRecords(client.atbToken, client.atbBaseId, client.atbTableNM, fields)
      } catch (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  }
}, CACHE_FLUSH_INTERVAL)

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});