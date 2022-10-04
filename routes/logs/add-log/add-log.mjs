import express from 'express';
import {LATE_DURATION, LOGTYPE, START_TIME, END_TIME, GENDER, smsStatus} from '../../../modules/constant/constant.mjs';
import { badRequest,response } from '../../../modules/response.mjs';
import { db } from '../../../modules/sql/connection.mjs';
import {addLogQuery, getSingleChildAndSmsQuery, updateSmsDeliveryByPhoneNumber} from '../../../modules/sql/query.mjs';
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

// modem.open('COM22', options, {});

// modem.on('open', data => {
//     modem.initializeModem((data)=>{
//         console.log("modem is initialized");
//     })
// })

const checkSms=(data)=>{
    if(data.data.response==smsStatus.SMS_SENT){
        db.query(updateSmsDeliveryByPhoneNumber,[data.data.recipient])
        .then(result=>{console.log('Sms sent')})
        .catch(err=>{console.log(err)});
    }
}

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
            await db.query(getSingleChildAndSmsQuery,[type,child_id])
                .then(async result=>{
                    let parentName=result.rows[0].phone_number_gender==GENDER.MAN?result.rows[0].father_fullname:result.rows[0].mother_fullname;
                    let m1=result.rows[0].sms.replace('_parent_name',parentName);
                    let m2=m1.replace('_child_name',result.rows[0].name);
                    let m3=m2.replace('_date',date_log);
                    let m4=m3.replace('_time',time_log);
                    let phoneNumber=result.rows[0].phone_number_gender==GENDER.MAN?result.rows[0].father_phone_number:result.rows[0].mother_phone_number;
                    console.log(`${m4}  / ${phoneNumber}`);
                    // await modem.sendSMS(phoneNumber,m4,true,(data)=>{
                    //     data.data.recipient=phoneNumber;
                    //     console.log(data);
                    //     checkSms(data);
                    // });
                })
                .catch(err=>{
                    console.log(err);
                })
            res.json(response(false,'success',result.rows[0]));
            res.end();
        } else {
            badRequest(req,res);
        }
    })
    .catch(err=>{
        console.log(err);
        badRequest(req,res);
    })
});

// modem.on('onSendingMessage', result => {
//     console.log(result);
//     checkSms(data);
// });

export {addLog};