import express from 'express';
import clientApi from "./client";
import fileApi from "./file";
import instructionApi from "./instruction";
import modelApi from "./model";
import uploadApi from "./upload";

const router = express.Router();

router.use("/client", clientApi);
router.use("/file", fileApi);
router.use("/instruction", instructionApi);
router.use("/upload", uploadApi);
router.use("/model", modelApi);

export default router;