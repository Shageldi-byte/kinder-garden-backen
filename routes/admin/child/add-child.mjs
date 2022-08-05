import express from 'express';
import { verifyToken } from '../../../modules/auth/token.mjs';
import { badRequest, response } from '../../../modules/response.mjs';
import { db } from '../../../modules/sql/connection.mjs';
import multer from 'multer';
import fs from 'fs';
import { addChildQuery } from '../../../modules/sql/query.mjs';

const addChildRouter = express.Router();
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
            cb(null,folder_docs);
        
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "."+file.originalname.substring(file.originalname.length-3,file.originalname.length))
    }
});

const upload = multer({ storage: storage });
const uploader = upload.fields([{ name:'image',maxCount:1},{ name:'docs',maxCount:1},{ name:'certificate',maxCount:1}]);
addChildRouter.post('/',verifyToken, checkFolder,uploader,(req,res) => {
    if(typeof req.body === 'undefined' || req.body == null){
        badRequest(req,res);
    } else{
        const image = req.files.image[0].filename;
        const docs = req.files.docs[0].destination + "/" + req.files.docs[0].filename;
        const certificate = req.files.certificate[0].destination + "/" + req.files.certificate[0].filename;
       
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
            qr_code,
            dob,
            enter_date,
            exit_date
        } = req.body;


        db.query(addChildQuery,[
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
            image, caregiver,
            caregiver_phone_number, 
            enter_date, exit_date, 
            fullinformation, 
            certificate, docs, 
            gender, address, 
            qr_code, dob
        ]).then(result=>{
            if(result.rows.length){
                res.json(response(false,'success',result.rows[0]));
                res.end();
            } else {
                badRequest(req,res);
            }
        })
        .catch(err=>{
            badRequest(req,res);
        });
    }
});

export {addChildRouter};