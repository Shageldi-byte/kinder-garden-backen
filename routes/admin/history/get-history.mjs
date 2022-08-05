import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/sql/connection.mjs";
import {LOGTYPE} from "../../../modules/constant/constant.mjs";
import format from "pg-format";
import {getHistoryQuery, getHistoryQueryCount} from "../../../modules/sql/query.mjs";

const getHistory = express.Router();

getHistory.post('/', (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            startDate,
            endDate,
            type,
            sms,
            child_id,
            group_id,
            page,
            limit
        } = req.body;

        let whereQuery='';

        if(startDate != null && startDate != '' && typeof startDate !== 'undefined'){
            let endD=new Date("YYYY-MM-DD");
            if(endDate != null && endDate != '' && typeof endDate !== 'undefined'){
                endD=endDate;
            }
            whereQuery += ` WHERE ((l.created_at,l.created_at) OVERLAPS ('${startDate}'::DATE,'${endD}'::DATE)) `;
        }

        if(typeof type !== 'undefined' && type != null && type !== ''){
            if(whereQuery==''){
                whereQuery+=" WHERE ";
            } else {
                whereQuery+=" AND ";
            }
            if(type==1){
                whereQuery+=` l.is_late=true `;
            }
            if(type==2){
                whereQuery+=` l.type='${LOGTYPE.ENTER}' `;
            }
            if(type==3){
                whereQuery+=` l.type='${LOGTYPE.EXIT}' `;
            }
        }

        if(typeof sms !== 'undefined' && sms != null && sms!==''){
            if(whereQuery==''){
                whereQuery+=" WHERE ";
            } else {
                whereQuery+=" AND ";
            }
            if(sms==1){
                whereQuery+=` l.is_delivery_sms=true `;
            }
            if(sms==2){
                whereQuery+=` l.is_delivery_sms=false `;
            }
        }

        if(typeof child_id !== 'undefined' && child_id != null && child_id!== '' && child_id!=0){
            if(whereQuery==''){
                whereQuery+=" WHERE ";
            } else {
                whereQuery+=" AND ";
            }
            whereQuery+=` l.child_id=${child_id} `;
        }


        if(typeof group_id !== 'undefined' && group_id != null && group_id!== '' && group_id!=0){
            if(whereQuery==''){
                whereQuery+=" WHERE ";
            } else {
                whereQuery+=" AND ";
            }
            whereQuery+=` c.group_id=${group_id} `;
        }

        let query = format(getHistoryQuery,whereQuery);

        db.query(query,[limit,page])
            .then(result=>{
                if(page==1){
                    db.query(format(getHistoryQueryCount,whereQuery))
                        .then(result_count=>{
                            let page_count = Math.round(result_count.rows.length/limit);
                            if(page_count <= 0){
                                page_count = 1;
                            }
                            res.json(response(false,'success',{logs:result.rows,page_count:page_count}));
                            res.end();
                        })
                        .catch(err=>{
                            console.log(err);
                            res.json(response(false,'success',{logs:result.rows,page_count:0}));
                            res.end();
                        })
                } else {
                    res.json(response(false,'success',{logs:result.rows,page_count:0}));
                    res.end();
                }
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            });


    }
});

export {getHistory};