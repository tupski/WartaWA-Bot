const { Client } = require('wwebjs');

const clients = {};

const createClient = (number) => {
    if (clients[number]) return clients[number];
    const client = new Client();
    client.initialize();
    clients[number] = client;
    return client;
};

module.exports = { createClient };
