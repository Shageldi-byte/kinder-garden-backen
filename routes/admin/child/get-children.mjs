import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import format from "pg-format";
import {getChildrenQuery} from "../../../modules/sql/query.mjs";
import {db} from "../../../modules/sql/connection.mjs";

const getChildren = express.Router();

getChildren.post('/', (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {group,month}=req.body;
        let whereQuery='';
        if(typeof group !== 'undefined' && group != null && group !=='' && group != 0){
            whereQuery=` WHERE c.group_id = ${group} `;
        }
        if(typeof month !== 'undefined' && month != null && month !=='' && month != 0){
            if(whereQuery==''){
                whereQuery=` WHERE to_char(c.dob, 'MM')='${month}' `;
            } else {
                whereQuery+=` AND to_char(c.dob, 'MM')='${month}' `;
            }
        }

        let query = format(getChildrenQuery,whereQuery);

        db.query(query)
            .then(result=>{
                res.json(response(false,'success',result.rows));
                res.end();
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })
    }
});

export {getChildren};