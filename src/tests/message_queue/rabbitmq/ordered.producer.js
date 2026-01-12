"use strict";

const amqp = require('amqplib');

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:123456@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, { durable: true });

    for (let i = 0; i < 10; i++) {
        const message = `Ordered Message ${i}`;
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", message);
    }

    setTimeout(() => {
        connection.close();
    }, 1000);
}

consumerOrderedMessage().catch(err => console.error(err));