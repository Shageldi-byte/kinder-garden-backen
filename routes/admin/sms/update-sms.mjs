import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/sql/connection.mjs";
import {updateSmsQuery} from "../../../modules/sql/query.mjs";

const updateSms = express.Router();

updateSms.put('/',verifyToken,(req,res)=>{
    if(typeof req.body === 'undefined' || req.body == null){
        badRequest(req,res);
    } else {
        const {
            sms,type
        } =req.body;
        db.query(updateSmsQuery,[sms,type])
            .then(result=>{
                if(result.rows.length){
                    res.json(response(false,'success',result.rows[0]));
                    res.end();
                } else {
                    badRequest(req,res);
                }
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
});

export {updateSms};