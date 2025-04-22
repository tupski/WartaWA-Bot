import React, { useEffect } from 'react';
import { useWhatsApp } from '../contexts/WhatsAppContext';
import QRCode from 'qrcode.react';

const DashboardPage = () => {
  const { status, qrCode, initialize, getStatus, getQR, reset, loading, error } = useWhatsApp();

  useEffect(() => {
    // Get initial status
    getStatus().catch(console.error);
  }, [getStatus]);

  const handleInitialize = () => {
    initialize().catch(console.error);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the WhatsApp connection? This will log you out from WhatsApp Web.')) {
      reset().catch(console.error);
    }
  };

  const handleRefreshQR = () => {
    getQR().catch(console.error);
  };

  const renderStatusBadge = () => {
    let color = 'gray';
    
    switch (status) {
      case 'ready':
        color = 'green';
        break;
      case 'authenticated':
        color = 'blue';
        break;
      case 'qr_received':
        color = 'yellow';
        break;
      case 'disconnected':
        color = 'red';
        break;
      case 'auth_failure':
        color = 'red';
        break;
      default:
        color = 'gray';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">WhatsApp Status</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <span className="font-medium mr-2">Status:</span>
          {renderStatusBadge()}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleInitialize}
            disabled={loading || status === 'ready'}
            className={`px-4 py-2 rounded-md text-white ${
              loading || status === 'ready' ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Initializing...' : 'Initialize WhatsApp'}
          </button>
          
          <button
            onClick={handleReset}
            disabled={loading || status === 'disconnected'}
            className={`px-4 py-2 rounded-md text-white ${
              loading || status === 'disconnected' ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Reset Connection
          </button>
        </div>
      </div>
      
      {status === 'qr_received' && qrCode && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan QR Code</h2>
          <p className="mb-4 text-gray-600">
            Scan this QR code with your WhatsApp app to connect your account.
          </p>
          
          <div className="flex flex-col items-center">
            <div className="border p-4 rounded-lg mb-4">
              <QRCode value={qrCode} size={256} />
            </div>
            
            <button
              onClick={handleRefreshQR}
              className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              Refresh QR Code
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Guide</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">1. Initialize WhatsApp</h3>
            <p className="text-gray-600">
              Click the "Initialize WhatsApp" button to start the connection process.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800">2. Scan QR Code</h3>
            <p className="text-gray-600">
              When a QR code appears, scan it with your WhatsApp app to authenticate.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800">3. Start Messaging</h3>
            <p className="text-gray-600">
              Once connected, you can send and receive messages through the Messages tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
