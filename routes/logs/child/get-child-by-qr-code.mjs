import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { badRequest,response } from '../../../modules/response.mjs';
import { db } from '../../../modules/sql/connection.mjs';
import { getChildByQrCodeQuery, getLastLogType } from '../../../modules/sql/query.mjs';

const getChildByQrCode = express.Router();

getChildByQrCode.post('/',async(req,res)=>{
    const {qrCode} = req.body;
    let child=null;
    await db.query(getChildByQrCodeQuery,[qrCode])
    .then(result=>{
        if(result.rows.length){
            child=result.rows[0];
            db.query(getLastLogType,[child.id])
            .then(result2=>{
                res.json(response(false,'success',{
                    child:child,
                    last_log:result2.rows[0]
                }));
                res.end();
            })
            .catch(error=>{
                res.json(response(false,'success',{
                    child:child,
                    last_log:null
                }));
                res.end();
            })
        } else {
            badRequest(req,res);
        }
        
    })
    .catch(err=>{
        badRequest(req,res);
    });

});

export {getChildByQrCode};