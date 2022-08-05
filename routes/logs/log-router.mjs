import express from 'express';
import { addLog } from './add-log/add-log.mjs';
import { getChildByQrCode } from './child/get-child-by-qr-code.mjs';

const logRouter=express.Router();

logRouter.use('/add-log',addLog);
logRouter.use('/get-child-by-qr-code',getChildByQrCode);

export {logRouter};