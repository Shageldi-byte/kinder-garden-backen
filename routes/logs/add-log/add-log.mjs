import express from 'express';
import { LATE_DURATION, LOGTYPE, START_TIME,END_TIME } from '../../../modules/constant/constant.mjs';
import { badRequest,response } from '../../../modules/response.mjs';
import { db } from '../../../modules/sql/connection.mjs';
import { addLogQuery } from '../../../modules/sql/query.mjs';
import serialportgsm from 'serialport-gsm';

const addLog = express.Router();

const getDiffernceInMinutes = (t1,t2) =>{
    let diff = Math.abs(t1-t2);
    return diff/(1000*60);
}

let modem = serialportgsm.Modem()
let options = {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    rtscts: false,
    xon: false,
    xoff: false,
    xany: false,
    autoDeleteOnReceive: true,
    enableConcatenation: true,
    incomingCallIndication: true,
    incomingSMSIndication: true,
    pin: '',
    customInitCommand: '',
    cnmiCommand: 'AT+CNMI=2,1,0,2,1',
    logger: console
}

modem.open('COM22', options, {});

modem.on('open', data => {
    modem.initializeModem((data)=>{
        console.log("modem is initialized");
    })
})

addLog.post('/',(req,res)=>{
   
    let is_delivery_sms=false;
    const{
        child_id,
        type
    }=req.body;


    let today=new Date();
    let time_log=`${today.getHours()}:${today.getMinutes()}`;
    let date_log=`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    let m=START_TIME.split(':')[1]-today.getMinutes();
    if(type===LOGTYPE.EXIT){
        m=END_TIME.split(':')[1]-today.getMinutes();
    }

    if(m<0){
        m*=-1;
    }
    let diff=(START_TIME.split(':')[0]-today.getHours())*60;
    if(type===LOGTYPE.EXIT){
        diff=(END_TIME.split(':')[0]-today.getHours())*60;
    }
    if(diff<0){
        diff*=-1;
    }
    diff+=m;
    let is_late=false;
    if(type==LOGTYPE.ENTER){
        if(diff>LATE_DURATION){
            is_late=true;
        }
    } else {
        is_late=false;
    }

    db.query(addLogQuery,[
        child_id,
        date_log,
        type,
        time_log,
        is_late,
        diff,
        is_delivery_sms
    ]).then(async result=>{
        if(result.rows.length){
            await modem.sendSMS('+99363430338','Fuck you',true,(data)=>{
                console.log(data);
            });
            res.json(response(false,'success',result.rows[0]));
        } else {
            badRequest(req,res);
        }
    })
    .catch(err=>{
        console.log(err);
        badRequest(req,res);
    })
});

modem.on('onSendingMessage', result => {
    console.log(result);
});

export {addLog};