import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { LOGTYPE } from '../../../modules/constant/constant.mjs';
import { badRequest,response } from '../../../modules/response.mjs';
import { db } from '../../../modules/sql/connection.mjs';
import format from 'pg-format';
import {getGroups} from "../../../modules/sql/query.mjs";

const getGroup=express.Router();

getGroup.get('/',verifyToken,(req,res)=>{
   db.query(getGroups)
       .then(result=>{
           res.json(response(false,'success',result.rows));
           res.end();
       })
       .catch(err=>{
           badRequest(req,res);
       });
});

export {getGroup};

