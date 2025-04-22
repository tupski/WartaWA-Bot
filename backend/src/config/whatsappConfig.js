const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');

const createClient = () => {
    const client = new Client({
        authStrategy: new LocalAuth({
            dataPath: process.env.WHATSAPP_SESSION_PATH
        })
    });

    client.on('qr', (qr) => {
        console.log('QR Code Received:', qr);
    });

    client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
    });

    client.on('authenticated', () => {
        console.log('WhatsApp authenticated!');
    });

    client.on('disconnected', () => {
        console.log('WhatsApp disconnected!');
    });

    return client;
};

module.exports = { createClient };
