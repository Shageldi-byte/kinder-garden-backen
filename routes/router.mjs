import express from 'express';
import { adminRouter } from './admin/admin-router.mjs';
import { loginRouter } from './auth/login.mjs';
import { logRouter } from './logs/log-router.mjs';

const router = express.Router();

router.use('/log',logRouter);
router.use('/admin',adminRouter);
router.use('/login',loginRouter);

export {router};