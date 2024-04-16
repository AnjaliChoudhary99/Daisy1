require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


async function sendSms(phoneNumber, smsText){
    await client.messages
    .create({
        body: smsText,
        from: '+12517147317',
        to: "+91"+phoneNumber
    })
    .then(message => console.log("success sending sms: sms.sid:" + message.sid));
}


module.exports = sendSms;