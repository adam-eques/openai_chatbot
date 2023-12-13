import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import { checkClientBody } from '../../../middleware/checkParam';
import { loadOpenAI, loadOpenAIAssistant, prisma } from '../../../utils';

const router = express.Router();

const upload = multer({
  dest: './uploads',
  fileFilter: (req, file, cb) => {
    switch (file.mimetype) {
      case "application/pdf":
      case "text/plain":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        cb(null, true)
        break;
      default:
        cb(null, false)
        break;
    }
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      console.log(file);
      let ext = "";
      switch (file.mimetype) {
        case "application/pdf":
          ext = ".pdf";
          break;
        case "text/plain":
          ext = ".txt";
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          ext = ".docx";
          break;
        default:
          break;
      }
      cb(null, Date.now() + ext) //Appending .jpg
    }
  })
})

router.route('/').post(upload.any(), checkClientBody, async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const uploadedInfo = req.files[0];
  const clientName = req.body.client
  console.log(uploadedInfo);
  if (uploadedInfo && clientName) {
    const client = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    }).catch((reason) => {
      console.error(reason);
      res.status(404).json({ error: "No such client" });
      return;
    });

    if (client === null || typeof client === "undefined") {
      res.status(404).json({ error: "No such client" });
      return;
    }

    try {
      const assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY || "", client.assistantId)
      const file_ids = assistant.file_ids
      if (file_ids.length >= 20) {
        res.status(400).json({ error: "Total files number must be less than 20 per assistant" });
        return;
      }

      const openai = loadOpenAI(process.env.OPENAI_API_KEY)
      const file = await openai.files.create({
        file: fs.createReadStream(uploadedInfo.path),
        purpose: "assistants",
      })
      await openai.beta.assistants.update(client.assistantId, {
        file_ids: [...file_ids, file.id]
      })
      // save original filename, uploaded file info and openai uploaded file id.
      const dbsaved = await prisma.file.create({
        data: {
          originalName: uploadedInfo.originalname,
          uploadedPath: uploadedInfo.path,
          openaiFileId: file.id,
          size: uploadedInfo.size,
          clientId: client.id,
        }
      })

      const files = await prisma.client.findFirst({
        where: {
          name: clientName,
        }
      }).File()

      const tmp = files.map((value) => {
        return {
          id: value.id,
          createdAt: value.createdAt,
          originalName: value.originalName,
          uploadedPath: value.uploadedPath,
          openaiFileId: value.openaiFileId,
          size: value.size,
        }
      })
      res.send({
        success: true,
        client: clientName,
        files: tmp,
        uploadedId: dbsaved.id,
      })
      return;
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: "Failed to upload file" })
    }
  } else {
    res.status(400).send({ message: "Failed to upload file" })
  }
})

export default router;