const https = require('https');
module.exports = {

    sendNotification(token, data) {

        const notification = JSON.stringify({
            'to': token,
            'data': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'notification': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAugC4D-Y:APA91bEw1GtzJAQpPc_GwDeqcR36qYkeCVlewiXHdAvYZqKTloZEbfnZbf1BEC-s9EaLkjmMGE-J7MOXdOw8GXvSSJhAVibZuHY-f-qSG57w10Gp0akRkfstx_HSnf0AuaZJMSE95d_1',
            }
        }

        const req = https.request(options, (res) => {
            console.log('STATUS CODE FIREBASE', res.statusCode);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (error) => {
            console.log('ERROR DE FIREBASE MESSAGING', error);
        });

        req.write(notification);
        req.end();

    },
    sendNotificationMultipleDevices(tokens, data) {

        const notification = JSON.stringify({
            'registration_ids': tokens,
            'data': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'notification': {
                'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAugC4D-Y:APA91bEw1GtzJAQpPc_GwDeqcR36qYkeCVlewiXHdAvYZqKTloZEbfnZbf1BEC-s9EaLkjmMGE-J7MOXdOw8GXvSSJhAVibZuHY-f-qSG57w10Gp0akRkfstx_HSnf0AuaZJMSE95d_1',
            }
        }

        const req = https.request(options, (res) => {
            console.log('STATUS CODE FIREBASE', res.statusCode);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (error) => {
            console.log('ERROR DE FIREBASE MESSAGING', error);
        });

        req.write(notification);
        req.end();

    }
}