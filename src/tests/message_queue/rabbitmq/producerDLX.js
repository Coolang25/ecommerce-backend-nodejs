const amqp = require('amqplib');
const { set } = require('lodash');

const message = 'Hello World!';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'; // notification exchange direct
        const notiQueue = 'notificationQueueProcess'; // assertQueue direct
        const notificationExchangeDLX = 'notificationExDLX'; // notification exchange DLX
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // routing key DLX

        // 1. Create exchange
        await channel.assertExchange(notificationExchange, 'direct', { durable: true });

        // 2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phép các kết nối khác sử dụng queue này
            deadLetterExchange: notificationExchangeDLX, // chỉ định exchange DLX
            deadLetterRoutingKey: notificationRoutingKeyDLX // chỉ định routing key DLX
        });

        // 3. bind queue to exchange
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // 4. Send message
        const msg = "Send a notification"
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        });

        setTimeout(async () => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
};

runProducer().catch(console.error);
