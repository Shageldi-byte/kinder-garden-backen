import express from 'express';
import {verifyToken} from "../../../modules/auth/token.mjs";
import {db} from "../../../modules/sql/connection.mjs";
import {deleteLogQuery} from "../../../modules/sql/query.mjs";
import {badRequest, response} from "../../../modules/response.mjs";

const deleteLog=express.Router();

deleteLog.delete('/:id',verifyToken,(req,res)=>{
    console.log(req.params.id);
    db.query(deleteLogQuery,[req.params.id])
        .then(result=>{
            res.json(response(false,'success','success'));
            res.end();
        })
        .catch(err=>{
            badRequest(req,res);
        })
});

export {deleteLog};