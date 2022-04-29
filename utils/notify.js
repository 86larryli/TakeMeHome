const config = require('../config');

const Core = require('@alicloud/pop-core');

const client = new Core({
    accessKeyId: config.ALIBABACLOUD_ACCESSKEYID,
    accessKeySecret: config.ALIBABACLOUD_ACCESSKEYSECRET,
    endpoint: 'https://dysmsapi.ap-southeast-1.aliyuncs.com',
    apiVersion: '2018-05-01'
});

async function sendSMS(phoneprefix, phone, message, res) {
    const params = {
        "RegionId": "ap-southeast-1",
        "To": String(phoneprefix) + String(phone),
        "Message": message,
        "From": "TakeMeHome"
    }

    client.request('SendMessageToGlobe', params, {
        method: 'POST'
    }).then((result) => {
        console.log(JSON.stringify(result));
        res.json({ success: 1, result: result });
    }, (ex) => {
        console.log(ex);
        res.json({ error: 1, message: JSON.stringify(ex) });
    });
}

module.exports = {
    sendSMS
}