import React, { useState, useEffect } from 'react';
import { useWhatsApp } from '../contexts/WhatsAppContext';
import { useAuth } from '../contexts/AuthContext';
import { FaSave, FaClock, FaMoon, FaBell, FaReply } from 'react-icons/fa';

const SettingsPage = () => {
  const { reset, status, settings, getAppSettings, updateSettings, loading, error } = useWhatsApp();
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoReply, setAutoReply] = useState(false);
  const [autoReplyMessage, setAutoReplyMessage] = useState('I am currently unavailable. I will get back to you soon.');
  const [timezone, setTimezone] = useState('Asia/Jakarta');
  const [saveMessage, setSaveMessage] = useState('');

  const handleResetWhatsApp = async () => {
    if (window.confirm('Are you sure you want to reset the WhatsApp connection? This will log you out from WhatsApp Web.')) {
      try {
        await reset();
        alert('WhatsApp connection has been reset successfully.');
      } catch (error) {
        alert(`Failed to reset WhatsApp connection: ${error.message}`);
      }
    }
  };

  // Load settings when component mounts
  useEffect(() => {
    getAppSettings().catch(console.error);
  }, [getAppSettings]);

  // Update local state when settings change
  useEffect(() => {
    if (settings && settings.timezone) {
      setTimezone(settings.timezone);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      // Save all settings
      await updateSettings({
        timezone,
        darkMode,
        notifications,
        autoReply,
        autoReplyMessage
      });
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Email</p>
            <p className="mt-1 text-sm text-gray-500">{user?.email || 'Not available'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Name</p>
            <p className="mt-1 text-sm text-gray-500">{user?.name || 'Not available'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">WhatsApp Status</p>
            <p className="mt-1 text-sm text-gray-500">{status}</p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetWhatsApp}
              disabled={status === 'disconnected'}
              className={`px-4 py-2 rounded-md text-white ${
                status === 'disconnected' ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Reset WhatsApp Connection
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Settings</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {saveMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{saveMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 flex items-center">
              <FaClock className="mr-2" /> Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
              <option value="Australia/Sydney">Australia/Sydney (GMT+10)</option>
              <option value="Pacific/Auckland">Pacific/Auckland (GMT+12)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Current time in selected timezone: {new Date().toLocaleString('en-US', { timeZone: timezone })}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 flex items-center">
                <FaMoon className="mr-2" /> Dark Mode
              </p>
              <p className="mt-1 text-sm text-gray-500">Enable dark theme for the application</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="dark-mode"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only"
              />
              <label
                htmlFor="dark-mode"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  darkMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    darkMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 flex items-center">
                <FaBell className="mr-2" /> Notifications</p>
              <p className="mt-1 text-sm text-gray-500">Receive notifications for new messages</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only"
              />
              <label
                htmlFor="notifications"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  notifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    notifications ? 'translate-x-4' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 flex items-center">
                <FaReply className="mr-2" /> Auto Reply</p>
              <p className="mt-1 text-sm text-gray-500">Automatically reply to incoming messages</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="auto-reply"
                checked={autoReply}
                onChange={() => setAutoReply(!autoReply)}
                className="sr-only"
              />
              <label
                htmlFor="auto-reply"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  autoReply ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    autoReply ? 'translate-x-4' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>

          {autoReply && (
            <div>
              <label htmlFor="auto-reply-message" className="block text-sm font-medium text-gray-700">
                Auto Reply Message
              </label>
              <textarea
                id="auto-reply-message"
                value={autoReplyMessage}
                onChange={(e) => setAutoReplyMessage(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className={`flex items-center justify-center px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Saving...' : (
                <>
                  <FaSave className="mr-2" /> Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
