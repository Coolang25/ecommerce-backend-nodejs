const redisPubSubService = require('../services/redisPubsub.service');

class InventoryTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (message) => {
            try {
                const { productId, quantity } = JSON.parse(message);
                InventoryTest.updateInventory(productId, quantity);
            } catch (err) {
                console.error("Failed to parse purchase event:", err);
            }
        });
    }

    static updateInventory(productId, quantity) {
        console.log(`Updating inventory for product ${productId} by reducing quantity ${quantity}`);
    }
}

module.exports = new InventoryTest();
