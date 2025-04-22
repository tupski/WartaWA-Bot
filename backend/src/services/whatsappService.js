const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let qrCode = null;
let connectionStatus = 'disconnected';
let messageHistory = [];
let settings = { timezone: 'Asia/Jakarta' }; // Default to GMT+7

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
const sendMessage = async (number, message, quotedMessageId = null) => {
    if (!client) {
        throw new Error('WhatsApp client not initialized');
    }

    if (connectionStatus !== 'ready') {
        throw new Error(`WhatsApp client not ready. Current status: ${connectionStatus}`);
    }

    try {
        // Format the number
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;

        let result;
        if (quotedMessageId) {
            // Find the quoted message
            const quotedMsg = messageHistory.find(msg => msg.id === quotedMessageId);
            if (quotedMsg) {
                // Get the message object from WhatsApp
                const messages = await client.searchMessages(quotedMsg.body, { chatId });
                if (messages && messages.length > 0) {
                    // Reply to the message
                    result = await client.sendMessage(chatId, message, { quotedMessageId: messages[0].id._serialized });
                } else {
                    // If message not found, send as normal message
                    result = await client.sendMessage(chatId, message);
                }
            } else {
                // If quoted message not found in history, send as normal message
                result = await client.sendMessage(chatId, message);
            }
        } else {
            // Send as normal message
            result = await client.sendMessage(chatId, message);
        }

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

// Get number info
const getNumberInfo = async (number) => {
    if (!client) {
        throw new Error('WhatsApp client not initialized');
    }

    if (connectionStatus !== 'ready') {
        throw new Error(`WhatsApp client not ready. Current status: ${connectionStatus}`);
    }

    try {
        // Format the number
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;

        // Get contact info
        const contact = await client.getContactById(chatId);

        return {
            id: contact.id.user,
            name: contact.name || contact.pushname || 'Unknown',
            number: contact.number,
            isGroup: contact.isGroup,
            isWAContact: contact.isWAContact,
            profilePicUrl: await contact.getProfilePicUrl() || null
        };
    } catch (error) {
        console.error('Error getting number info:', error);
        throw error;
    }
};

// Get all groups
const getGroups = async () => {
    if (!client) {
        throw new Error('WhatsApp client not initialized');
    }

    if (connectionStatus !== 'ready') {
        throw new Error(`WhatsApp client not ready. Current status: ${connectionStatus}`);
    }

    try {
        // Get all chats
        const chats = await client.getChats();

        // Filter group chats
        const groups = chats.filter(chat => chat.isGroup);

        // Map to simplified objects
        return groups.map(group => ({
            id: group.id._serialized,
            name: group.name,
            participants: group.participants.length,
            unreadCount: group.unreadCount
        }));
    } catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
};

// Get group info
const getGroupInfo = async (groupId) => {
    if (!client) {
        throw new Error('WhatsApp client not initialized');
    }

    if (connectionStatus !== 'ready') {
        throw new Error(`WhatsApp client not ready. Current status: ${connectionStatus}`);
    }

    try {
        // Get the group chat
        const chat = await client.getChatById(groupId);

        if (!chat.isGroup) {
            throw new Error('Not a group chat');
        }

        // Get participants with details
        const participants = [];
        for (const participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            participants.push({
                id: contact.id.user,
                name: contact.name || contact.pushname || 'Unknown',
                number: contact.number,
                isAdmin: participant.isAdmin || false
            });
        }

        return {
            id: chat.id._serialized,
            name: chat.name,
            description: chat.description || '',
            owner: chat.owner ? chat.owner.user : null,
            createdAt: chat.createdAt || null,
            participants: participants,
            unreadCount: chat.unreadCount
        };
    } catch (error) {
        console.error('Error getting group info:', error);
        throw error;
    }
};

// Get settings
const getSettings = () => {
    return settings;
};

// Update settings
const updateSettings = (newSettings) => {
    settings = { ...settings, ...newSettings };
    return settings;
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
    resetClient,
    getNumberInfo,
    getGroups,
    getGroupInfo,
    getSettings,
    updateSettings
};
