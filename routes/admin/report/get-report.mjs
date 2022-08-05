import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { LOGTYPE } from '../../../modules/constant/constant.mjs';
import { badRequest,response } from '../../../modules/response.mjs';
import { db } from '../../../modules/sql/connection.mjs';
import format from 'pg-format';
import { getReportQuery,getReportNonCame } from '../../../modules/sql/query.mjs';

const getReportRouter = express.Router();

getReportRouter.post('/',verifyToken,(req,res)=>{
    if(typeof req.body === 'undefined' || req.body == null){
        badRequest(req,res);
    } else {
        const {type}=req.body;
        let whereQuery=``;
        if(typeof type !== 'undefined' && type != null && type != ''){
            if(type==1){
                whereQuery=` WHERE l.is_late=true `;
            }
            if(type==3){
                whereQuery=` WHERE l.is_delivery_sms=false `;
            }
            if(type==4){
                whereQuery=` WHERE l.type='${LOGTYPE.ENTER}' `;
            }
            if(type==5){
                whereQuery=` WHERE l.type='${LOGTYPE.EXIT}' `;
            }
        }

        if(whereQuery==''){
            whereQuery=` WHERE to_char(l.created_at, 'DD')=to_char(now(),'DD')
            AND to_char(l.created_at, 'MM')=to_char(now(),'MM')
            AND to_char(l.created_at, 'YYYY')=to_char(now(),'YYYY') `;
        } else {
            whereQuery+=` AND to_char(l.created_at, 'DD')=to_char(now(),'DD')
            AND to_char(l.created_at, 'MM')=to_char(now(),'MM')
            AND to_char(l.created_at, 'YYYY')=to_char(now(),'YYYY') `;
        }

        let query = format(getReportQuery,whereQuery);

        if(type==2){
            query=getReportNonCame;
        }

        db.query(query)
        .then(result=>{
            res.json(response(false,'success',result.rows));
        })
        .catch(err=>{
            console.log(err);
            badRequest(req,res);
        })
    }
});

export {getReportRouter};