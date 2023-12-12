import express from 'express';
import clientApi from "./client";
import fileApi from "./file";
import instructionApi from "./instruction";
import uploadApi from "./upload";

const router = express.Router();

router.use("/instruction", instructionApi);
router.use("/upload", uploadApi);
router.use("/file", fileApi);
router.use("/client", clientApi);

export default router;