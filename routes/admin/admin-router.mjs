import express from 'express';
import { getReportRouter } from './report/get-report.mjs';
import {getGroup} from "./group/get-group.mjs";
import {addGroup} from "./group/add-group.mjs";
import {getChildren} from "./child/get-children.mjs";
import {getHistory} from "./history/get-history.mjs";
import {getSingleChild} from "./child/get-single-child.mjs";
import {removeChild} from "./child/remove-child.mjs";
import { addChildRouter } from './child/add-child.mjs';
import { editChildRouter } from './child/edit-child.mjs';
import {deleteLog} from "./history/delete-log.mjs";
import {updateSms} from "./sms/update-sms.mjs";
import {getSms} from "./sms/get-sms.mjs";

const adminRouter = express.Router();

adminRouter.use('/get-report',getReportRouter);
adminRouter.use('/get-group',getGroup);
adminRouter.use('/add-group',addGroup);
adminRouter.use('/get-children',getChildren);
adminRouter.use('/get-history',getHistory);
adminRouter.use('/get-single-child',getSingleChild);
adminRouter.use('/delete-child',removeChild);
adminRouter.use('/add-child',addChildRouter);
adminRouter.use('/edit-child',editChildRouter);
adminRouter.use('/delete-log',deleteLog);
adminRouter.use('/update-sms',updateSms);
adminRouter.use('/get-sms',getSms);

export {adminRouter};