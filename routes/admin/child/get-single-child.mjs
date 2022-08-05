import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/sql/connection.mjs";
import {getSingleChildQuery} from "../../../modules/sql/query.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const getSingleChild = express.Router();

getSingleChild.get('/', verifyToken,(req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const child_id=req.query.child_id;
        db.query(getSingleChildQuery,[child_id])
            .then(result=>{
                res.json(response(false,'success',result.rows[0]));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
});

export {getSingleChild};