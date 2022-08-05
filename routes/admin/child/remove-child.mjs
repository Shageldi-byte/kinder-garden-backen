import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {removeChildLog, removeChildQuery} from "../../../modules/sql/query.mjs";
import {db} from "../../../modules/sql/connection.mjs";
import {verifyToken} from "../../../modules/auth/token.mjs";

const removeChild = express.Router();

removeChild.delete('/:child_id',verifyToken, async(req, res) => {
    if (typeof req.params === 'undefined' || req.params == null) {
        badRequest(req, res);
    } else {
        const child_id = req.params.child_id;
        console.log(child_id);
        await db.query(removeChildQuery,[child_id])
            .then(result => {
                db.query(removeChildLog,[child_id])
                    .then(result2 => {
                        res.json(response(false,'success',null));
                        res.end();
                    })
                    .catch(err => {
                        badRequest(req,res);
                    })
            })
            .catch(err => {
                badRequest(req,res);
            })
    }
});

export {removeChild};