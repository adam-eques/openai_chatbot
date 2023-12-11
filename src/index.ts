import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';

config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'))

process.on("unhandledRejection", (err: Error) => {
  console.error(`Unhandled rejection: ${err}`, err.stack);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
