const redisPubSubService = require('../services/redisPubsub.service');

class ProductTest {
    async purchaseProduct(productId, quantity) {
        const order = { productId, quantity };

        try {
            await redisPubSubService.publish('purchase_events', JSON.stringify(order));
            console.log("Purchase event published:", order);
        } catch (err) {
            console.error("Failed to publish purchase event:", err);
        }
    }
}

module.exports = new ProductTest();
