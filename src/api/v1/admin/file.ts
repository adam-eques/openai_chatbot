import express, { NextFunction, Request, Response } from 'express';
import { loadOpenAI, loadOpenAIAssistant, prisma } from '../../../utils';

const router = express.Router();

router.route('/all').get(async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  const clientName = req.body.client

  try {
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
    })
  } catch (error) {
    console.error(error)
    res.status(404).send("Failed to get all files");
  }
})

router.delete('/all', async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  try {
    const clientName = req.body.client;
    const client = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    }).catch((reason) => {
      console.error(reason);
    });

    if (client === null || typeof client === "undefined") {
      res.status(404).json({ error: "No such client" });
      return;
    }

    const openai = loadOpenAI(process.env.OPENAI_API_KEY);
    await openai.beta.assistants.update(
      client.assistantId,
      {
        file_ids: [],
      }
    );

    await prisma.file.deleteMany({
      where: {
        clientId: client.id,
      }
    })

    res.send({
      success: true,
      client: clientName,
    })
  } catch (error) {
    console.error(error)
    res.status(404).send({ error: "Failed to remove file" });
  }
})


router.delete('/:id', async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
  try {
    const clientName = req.body.client;
    const fileId = req.params.id
    const client = await prisma.client.findFirst({
      where: {
        name: clientName,
      }
    }).catch((reason) => {
      console.error(reason);
    });

    if (client === null || typeof client === "undefined") {
      res.status(404).json({ error: "No such client" });
      return;
    }

    const deletedInfo = await prisma.file.delete({
      where: {
        id: Number(req.params.id)
      }
    })

    const openai = loadOpenAI(process.env.OPENAI_API_KEY);
    const assistant = await loadOpenAIAssistant(process.env.OPENAI_API_KEY, client.assistantId);
    const file_ids = (await assistant).file_ids.filter((value) => value !== deletedInfo.openaiFileId)
    await openai.beta.assistants.update(
      client.assistantId,
      {
        file_ids: file_ids,
      }
    );

    res.send({
      success: true,
      client: clientName,
      fileId: deletedInfo.id,
    })
  } catch (error) {
    console.error(error)
    res.status(404).send({ error: "Failed to remove file" });
  }
})


export default router;