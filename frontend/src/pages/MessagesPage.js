import React, { useState, useEffect } from 'react';
import { useWhatsApp } from '../contexts/WhatsAppContext';
import { FaReply, FaInfoCircle } from 'react-icons/fa';

const MessagesPage = () => {
  const {
    messages,
    sendMessage,
    replyToMessage,
    getMessageHistory,
    getNumberInfo,
    status,
    loading,
    error,
    formatTimestamp
  } = useWhatsApp();

  const [number, setNumber] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sendError, setSendError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    // Get message history when component mounts
    getMessageHistory().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validate phone number format
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(number.replace(/\D/g, ''))) {
      setSendError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    if (!messageText) {
      setSendError('Please enter a message');
      return;
    }

    try {
      setSendError('');

      if (replyingTo) {
        // Send as a reply
        await replyToMessage(number, messageText, replyingTo.id);
        setReplyingTo(null); // Clear reply state
      } else {
        // Send as a normal message
        await sendMessage(number, messageText);
      }

      setMessageText(''); // Clear message input after sending
    } catch (error) {
      setSendError(error.message || 'Failed to send message');
    }
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);
    setNumber(msg.direction === 'incoming' ? formatPhoneNumber(msg.from) : formatPhoneNumber(msg.to));
    // Focus on the message input
    document.getElementById('message').focus();
  };

  const handleGetInfo = async (phoneNumber) => {
    try {
      await getNumberInfo(phoneNumber);
    } catch (error) {
      console.error('Failed to get number info:', error);
    }
  };

  // Use the formatTimestamp from context instead

  const formatPhoneNumber = (phoneNumber) => {
    // Remove the @c.us suffix if present
    return phoneNumber.replace('@c.us', '');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Message</h2>

        {status !== 'ready' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">
              WhatsApp is not ready. Current status: {status}. Please initialize WhatsApp from the Dashboard.
            </span>
          </div>
        )}

        {sendError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{sendError}</span>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., 1234567890"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Type your message here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || status !== 'ready'}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || status !== 'ready' ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Message History</h2>
          <button
            onClick={() => getMessageHistory()}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No messages yet</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.direction === 'outgoing'
                    ? 'bg-blue-100 ml-12'
                    : 'bg-gray-100 mr-12'
                }`}
              >
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>
                    {msg.direction === 'outgoing'
                      ? `To: ${formatPhoneNumber(msg.to)}`
                      : `From: ${formatPhoneNumber(msg.from)}`}
                  </span>
                  <span>{formatTimestamp(msg.timestamp)}</span>
                </div>

                {replyingTo && replyingTo.id === msg.id && (
                  <div className="bg-yellow-50 p-2 rounded mb-2 text-xs border-l-2 border-yellow-400">
                    <p className="font-semibold">Replying to this message</p>
                  </div>
                )}

                <p className="text-gray-800">{msg.body}</p>

                <div className="flex mt-2 justify-end space-x-2">
                  <button
                    onClick={() => handleReply(msg)}
                    className="text-gray-500 hover:text-blue-500 text-sm flex items-center"
                    title="Reply to this message"
                  >
                    <FaReply className="mr-1" /> Reply
                  </button>

                  <button
                    onClick={() => handleGetInfo(msg.direction === 'outgoing' ? msg.to : msg.from)}
                    className="text-gray-500 hover:text-blue-500 text-sm flex items-center"
                    title="Get contact info"
                  >
                    <FaInfoCircle className="mr-1" /> Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
