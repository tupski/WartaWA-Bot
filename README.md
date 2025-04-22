# WartaWA

## 📚 Description
WartaWA is a powerful WhatsApp messaging platform that integrates a Node.js/Express backend with a React.js frontend. The application allows users to send and receive WhatsApp messages through the WhatsApp Web service, providing an easy-to-use interface for managing WhatsApp communications. "Warta" means "news" or "message" in Indonesian, making WartaWA the perfect name for your WhatsApp messaging solution.

---

## 🚀 Features
- **User Authentication**: Secure login and registration system
- **WhatsApp Integration**: Send and receive messages through WhatsApp Web
- **Dashboard**: Monitor WhatsApp connection status and activities
- **Message Management**: View message history and send new messages
- **Contact Management**: Add, edit, and delete contacts
- **Settings**: Configure application preferences and WhatsApp connection
- **Profile Management**: Update user profile and change password
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes
- **PWA Support**: Progressive Web App capabilities for offline use

---

## 🛠️ Technologies & Tools

### Backend
- [Node.js](https://nodejs.org) - JavaScript runtime environment
- [Express.js](https://expressjs.com) - Web application framework
- [whatsapp-web.js](https://wwebjs.dev/) - WhatsApp Web API
- [MySQL](https://www.mysql.com/) - Relational database
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication

### Frontend
- [React.js](https://reactjs.org) - JavaScript library for building user interfaces
- [React Router](https://reactrouter.com) - Routing for React applications
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - Promise-based HTTP client
- [Context API](https://reactjs.org/docs/context.html) - State management

---

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL database

---

## 🖥️ Installation & Setup

### Easy Installation (Recommended)

#### Windows
1. Download the repository or clone it:
   ```bash
   git clone https://github.com/tupski/WartaWA-Bot.git
   cd WartaWA-Bot
   ```

2. Run the installer by double-clicking `Install-WartaWA.bat`

3. Choose your preferred installation method:
   - **Option 1**: Command-line installer (PowerShell)
   - **Option 2**: Graphical installer (Web browser)

4. Follow the prompts to enter your MySQL database credentials and other configuration options

5. After installation completes, use the generated start scripts:
   - `start-all.bat` - Starts both backend and frontend servers
   - `start-backend.bat` - Starts only the backend server
   - `start-frontend.bat` - Starts only the frontend server

#### Linux
1. Clone the repository:
   ```bash
   git clone https://github.com/tupski/WartaWA-Bot.git
   cd WartaWA-Bot
   ```

2. Run the installer script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. Follow the prompts to enter your MySQL database credentials and other configuration options

4. After installation completes, use the generated start scripts:
   ```bash
   # Start both backend and frontend
   ./start-all.sh

   # Or start them separately
   ./start-backend.sh
   ./start-frontend.sh
   ```

### Manual Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/tupski/WartaWA-Bot.git
cd WartaWA-Bot
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# Set up database credentials and JWT secret

# Create database tables
mysql -u your_username -p your_database < src/db/schema.sql

# Start the backend server
npm start
```

#### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

---

## 🚀 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account or login with the default admin credentials:
   - Email: admin@example.com
   - Password: admin123
3. Navigate to the Dashboard and click "Initialize WhatsApp"
4. Scan the QR code with your WhatsApp mobile app:
   - Open WhatsApp on your phone
   - Tap Menu or Settings and select WhatsApp Web
   - Point your phone to the QR code on the screen
5. Once connected, you can send and receive messages through the Messages tab

---

## 📱 WhatsApp Features

- **Send Messages**: Send text messages to any WhatsApp number
- **Receive Messages**: View incoming messages in real-time
- **Message History**: View history of sent and received messages
- **Contact Management**: Manage your WhatsApp contacts
- **Connection Status**: Monitor the status of your WhatsApp connection

---

## 🔒 Security Considerations

- This application stores WhatsApp session data locally
- Never share your session data or .env file
- Use strong passwords for your admin account
- In production, always use HTTPS

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
