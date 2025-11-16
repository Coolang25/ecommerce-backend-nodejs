const { createClient } = require('redis');

class RedisPubSubService {
    constructor() {
        const host = process.env.REDIS_HOST;
        const port = process.env.REDIS_PORT;
        const username = process.env.REDIS_USERNAME;
        const password = process.env.REDIS_PASSWORD;

        const url = `redis://${username}:${password}@${host}:${port}`;

        this.publisher = createClient({ url });
        this.subscriber = createClient({ url });

        this.isConnected = false;

        this.ready = this._connect();
    }

    async _connect() {
        if (this.isConnected) return;
        try {
            await this.publisher.connect();
            await this.subscriber.connect();
            this.isConnected = true;
            console.log("Redis Pub/Sub connected!");
        } catch (err) {
            console.error("Failed to connect Redis:", err);
            throw err;
        }
    }

    async publish(channel, message) {
        await this.ready;
        return await this.publisher.publish(channel, message);
    }

    async subscribe(channel, callback) {
        await this.ready;
        await this.subscriber.subscribe(channel, callback);
        console.log(`Subscribed to channel: ${channel}`);
    }

    async unsubscribe(channel) {
        await this.ready;
        await this.subscriber.unsubscribe(channel);
        console.log(`Unsubscribed from channel: ${channel}`);
    }

    async close() {
        await this.publisher.quit();
        await this.subscriber.quit();
        this.isConnected = false;
        console.log("Redis Pub/Sub closed.");
    }
}

module.exports = new RedisPubSubService();
