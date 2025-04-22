import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { whatsappAPI } from '../services/api';
import { useAuth } from './AuthContext';

// Create context
const WhatsAppContext = createContext();

// WhatsApp provider component
export const WhatsAppProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('disconnected');
  const [qrCode, setQrCode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [numberInfo, setNumberInfo] = useState(null);
  const [settings, setSettings] = useState({ timezone: 'Asia/Jakarta' }); // Default to GMT+7
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize WhatsApp client
  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.initialize();
      setStatus(response.data.data.status);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to initialize WhatsApp');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get WhatsApp status
  const getStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.getStatus();
      setStatus(response.data.data.status);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get WhatsApp status');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get QR code
  const getQR = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.getQR();
      setQrCode(response.data.data.qrCode);
      return response.data.data.qrCode;
    } catch (error) {
      if (error.response?.status !== 404) {
        setError(error.response?.data?.message || 'Failed to get QR code');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (number, message) => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.sendMessage(number, message);
      // Refresh messages after sending
      await getMessageHistory();
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get message history
  const getMessageHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.getHistory();
      setMessages(response.data.data.messages);
      return response.data.data.messages;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get message history');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset WhatsApp client
  const reset = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.reset();
      setStatus('disconnected');
      setQrCode(null);
      setMessages([]);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset WhatsApp client');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get number info
  const getNumberInfo = useCallback(async (number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.getNumberInfo(number);
      setNumberInfo(response.data.data);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get number info');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get groups
  const getGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.getGroups();
      setGroups(response.data.data);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get groups');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get group info
  const getGroupInfo = useCallback(async (groupId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.getGroupInfo(groupId);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get group info');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get settings
  const getAppSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.getSettings();
      setSettings(response.data.data);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to get settings');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update settings
  const updateSettings = useCallback(async (newSettings) => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.updateSettings(newSettings);
      setSettings(response.data.data);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update settings');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message with reply
  const replyToMessage = useCallback(async (number, message, quotedMessageId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappAPI.sendMessage(number, message, quotedMessageId);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reply');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for status updates when authenticated
  useEffect(() => {
    let statusInterval;

    if (isAuthenticated) {
      // Initial status check
      getStatus().catch(console.error);

      // Set up polling
      statusInterval = setInterval(() => {
        // Get the current status
        getStatus().catch(console.error);
      }, 5000);
    }

    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [isAuthenticated, getStatus]); // Include getStatus in dependencies

  // Handle status changes
  useEffect(() => {
    if (!isAuthenticated) return;

    // If status is 'qr_received', try to get QR code
    if (status === 'qr_received') {
      getQR().catch(console.error);
    }

    // If status is 'ready', get message history
    if (status === 'ready') {
      getMessageHistory().catch(console.error);
    }
  }, [status, isAuthenticated, getQR, getMessageHistory]);

  // Load settings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getAppSettings().catch(console.error);
      getGroups().catch(console.error);
    }
  }, [isAuthenticated, getAppSettings, getGroups]);

  // Format timestamp with timezone
  const formatTimestamp = useCallback((timestamp) => {
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        timeZone: settings.timezone || 'Asia/Jakarta',
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return new Date(timestamp).toLocaleString();
    }
  }, [settings.timezone]);

  // Context value
  const value = {
    status,
    qrCode,
    messages,
    groups,
    numberInfo,
    settings,
    loading,
    error,
    initialize,
    getStatus,
    getQR,
    sendMessage,
    getMessageHistory,
    reset,
    getNumberInfo,
    getGroups,
    getGroupInfo,
    getAppSettings,
    updateSettings,
    replyToMessage,
    formatTimestamp,
  };

  return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>;
};

// Custom hook to use WhatsApp context
export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};

export default WhatsAppContext;
