import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { badRequest, response } from '../../../modules/response.mjs';
import { db } from '../../../modules/sql/connection.mjs';
import multer from 'multer';
import fs from 'fs';
import { addChildQuery, getSingleChildQuery, updateChildQuery } from '../../../modules/sql/query.mjs';

const editChildRouter = express.Router();
const folder = 'public/image/children';
const folder_docs = 'public/docs';

const checkFolder = (req, res, next) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    if (!fs.existsSync(folder_docs)) {
        fs.mkdirSync(folder_docs, { recursive: true });
    }
    next();
}



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image')
            cb(null, folder);
        else if (file.fieldname === 'docs' || file.fieldname === 'certificate')
            cb(null, folder_docs);

    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.substring(file.originalname.length - 3, file.originalname.length))
    }
});

const getOldImages = async (req, res, next) => {
    const id = req.body.id;
    await db.query(getSingleChildQuery, [id])
        .then(result => {
            if (result.rows.length) {
                req.old_image = result.rows[0].child_image;
                req.doc_certificate = result.rows[0].born_certificate_file;
                req.doc_file = result.rows[0].doc_file;
            }
            next();
        })
        .catch(err => {
            next();
        })
}

const upload = multer({ storage: storage });
const uploader = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'docs', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]);
editChildRouter.post('/', verifyToken, checkFolder, uploader, getOldImages, (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {


        let image = req.old_image;
        let docs = req.doc_file;
        let certificate = req.doc_certificate;

        if (typeof req.files.image !== "undefined" && req.files.image != null && req.files.image != '') {
            image = req.files.image[0].filename;
        }

        if (typeof req.files.docs !== "undefined" && req.files.docs != null && req.files.docs != '') {
            docs = req.files.docs[0].destination + "/" + req.files.docs[0].filename;
        }

        if (typeof req.files.certificate !== "undefined" && req.files.certificate != null && req.files.certificate != '') {
            certificate = req.files.certificate[0].destination + "/" + req.files.certificate[0].filename;
        }


        const {
            name,
            surname,
            middlename,
            group_id,
            faa,
            father_phone_number,
            father_work_address,
            maa,
            mother_phone_number,
            mother_work_address,
            phone_number_gender,
            caregiver,
            caregiver_phone_number,
            address,
            gender,
            fullinformation,
            dob,
            enter_date,
            exit_date,
            id
        } = req.body;


        db.query(updateChildQuery, [
            name,
            surname,
            middlename,
            0,
            group_id,
            faa,
            father_phone_number,
            father_work_address,
            maa,
            mother_phone_number,
            mother_work_address,
            phone_number_gender,
            image, caregiver,
            caregiver_phone_number,
            enter_date, exit_date,
            fullinformation,
            certificate, docs,
            gender, address, dob, id
        ]).then(result => {
            if (result.rows.length) {
                res.json(response(false, 'success', result.rows[0]));
                res.end();
            } else {
                badRequest(req, res);
            }
        })
            .catch(err => {
                console.log(err);
                badRequest(req, res);
            });
    }
});

export { editChildRouter };