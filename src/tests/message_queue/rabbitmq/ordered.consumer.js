"use strict";

const amqp = require('amqplib');

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:123456@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, { durable: true });

    // set prefetch to 1 to ensure ordered processing
    channel.prefetch(1);

    channel.consume(queueName, (msg) => {
        const messageContent = msg.content.toString();

        setTimeout(() => {
            console.log("processed: ", messageContent);
            channel.ack(msg);
        }, Math.random() * 1000);
    });
}

consumerOrderedMessage().catch(err => console.error(err));