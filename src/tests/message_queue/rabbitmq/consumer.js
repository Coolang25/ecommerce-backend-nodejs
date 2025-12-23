const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, { durable: false });

        channel.consume(queueName, (msg) => {
            console.log(" [x] Received '%s'", msg.content.toString());
        }, {
            noAck: true
        });
    } catch (error) {
        console.error(error);
    }
};

runConsumer().catch(console.error);
