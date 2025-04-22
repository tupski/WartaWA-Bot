const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let qrCode = null;
let connectionStatus = 'disconnected';
let messageHistory = [];

// Initialize WhatsApp client
const initializeClient = () => {
    if (client) return client;

    client = new Client({
        authStrategy: new LocalAuth({
            dataPath: process.env.WHATSAPP_SESSION_PATH || './whatsapp-sessions'
        }),
        puppeteer: {
            args: ['--no-sandbox']
        }
    });

    // Event handlers
    client.on('qr', (qr) => {
        qrCode = qr;
        connectionStatus = 'qr_received';
        console.log('QR Code received');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        connectionStatus = 'ready';
        qrCode = null;
        console.log('WhatsApp client is ready!');
    });

    client.on('authenticated', () => {
        connectionStatus = 'authenticated';
        console.log('WhatsApp authenticated!');
    });

    client.on('auth_failure', (msg) => {
        connectionStatus = 'auth_failure';
        console.error('Authentication failure:', msg);
    });

    client.on('disconnected', (reason) => {
        connectionStatus = 'disconnected';
        console.log('WhatsApp disconnected:', reason);
    });

    client.on('message', (message) => {
        console.log(`Message received: ${message.body}`);
        // Store message in history
        messageHistory.push({
            id: message.id.id,
            from: message.from,
            body: message.body,
            timestamp: message.timestamp,
            direction: 'incoming'
        });

        // Limit history size
        if (messageHistory.length > 100) {
            messageHistory.shift();
        }
    });

    client.initialize();
    return client;
};

// Send a message
const sendMessage = async (number, message) => {
    if (!client) {
        throw new Error('WhatsApp client not initialized');
    }

    if (connectionStatus !== 'ready') {
        throw new Error(`WhatsApp client not ready. Current status: ${connectionStatus}`);
    }

    try {
        // Format the number
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        const result = await client.sendMessage(chatId, message);

        // Store message in history
        messageHistory.push({
            id: result.id.id,
            to: chatId,
            body: message,
            timestamp: Date.now(),
            direction: 'outgoing'
        });

        // Limit history size
        if (messageHistory.length > 100) {
            messageHistory.shift();
        }

        return result;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Get client status
const getClientStatus = () => {
    return {
        status: connectionStatus,
        hasQR: qrCode !== null
    };
};

// Get QR code
const getQRCode = () => {
    return qrCode;
};

// Get message history
const getMessageHistory = () => {
    return messageHistory;
};

// Reset client
const resetClient = async () => {
    if (client) {
        await client.destroy();
        client = null;
        qrCode = null;
        connectionStatus = 'disconnected';
        messageHistory = [];
    }
};

module.exports = {
    initializeClient,
    sendMessage,
    getClientStatus,
    getQRCode,
    getMessageHistory,
    resetClient
};
