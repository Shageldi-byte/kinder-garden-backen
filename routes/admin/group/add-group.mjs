import express from 'express';
import {badRequest, response} from "../../../modules/response.mjs";
import {db} from "../../../modules/sql/connection.mjs";
import {addGroupQuery} from "../../../modules/sql/query.mjs";

const addGroup = express.Router();

addGroup.post('/', (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            group_name,
            group_number,
            group_room,
        } = req.body;
        db.query(addGroupQuery, [group_name, group_number, group_room])
            .then(result => {
                if (result.rows.length) {
                    res.json(response(false, 'success', result.rows[0]));
                    res.end();
                } else {
                    badRequest(req,res);
                }
            })
            .catch(err => {
                badRequest(req, res);
            })
    }
});

export {addGroup};