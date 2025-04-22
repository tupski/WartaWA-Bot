const {
    initializeClient,
    sendMessage,
    getClientStatus,
    getQRCode,
    getMessageHistory,
    resetClient
} = require('../services/whatsappService');

// Initialize WhatsApp client
const initialize = async (_req, res) => {
    try {
        initializeClient();
        res.status(200).json({
            status: 'success',
            message: 'WhatsApp client initialization started',
            data: getClientStatus()
        });
    } catch (error) {
        console.error('Error initializing WhatsApp client:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to initialize WhatsApp client',
            error: error.message
        });
    }
};

// Send a message
const send = async (req, res) => {
    try {
        const { number, message } = req.body;

        if (!number || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Phone number and message are required'
            });
        }

        const result = await sendMessage(number, message);

        res.status(200).json({
            status: 'success',
            message: 'Message sent successfully',
            data: {
                to: number,
                messageId: result.id.id,
                timestamp: Date.now()
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// Get WhatsApp client status
const getStatus = (_req, res) => {
    try {
        const status = getClientStatus();
        res.status(200).json({
            status: 'success',
            data: status
        });
    } catch (error) {
        console.error('Error getting status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get WhatsApp client status',
            error: error.message
        });
    }
};

// Get QR code for WhatsApp Web authentication
const getQR = (_req, res) => {
    try {
        const qrCode = getQRCode();

        if (!qrCode) {
            return res.status(404).json({
                status: 'error',
                message: 'QR code not available. Client might be already authenticated or not initialized.'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                qrCode
            }
        });
    } catch (error) {
        console.error('Error getting QR code:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get QR code',
            error: error.message
        });
    }
};

// Get message history
const getHistory = (_req, res) => {
    try {
        const history = getMessageHistory();
        res.status(200).json({
            status: 'success',
            data: {
                messages: history
            }
        });
    } catch (error) {
        console.error('Error getting message history:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get message history',
            error: error.message
        });
    }
};

// Reset WhatsApp client
const reset = async (_req, res) => {
    try {
        await resetClient();
        res.status(200).json({
            status: 'success',
            message: 'WhatsApp client reset successfully'
        });
    } catch (error) {
        console.error('Error resetting WhatsApp client:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to reset WhatsApp client',
            error: error.message
        });
    }
};

module.exports = {
    initialize,
    send,
    getStatus,
    getQR,
    getHistory,
    reset
};
