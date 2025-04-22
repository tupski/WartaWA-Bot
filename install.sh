#!/bin/bash

# WartaWA Installer for Linux
# This script will install and configure WartaWA

# Function to display colored text
print_color() {
    case $1 in
        "green") echo -e "\e[32m$2\e[0m" ;;
        "red") echo -e "\e[31m$2\e[0m" ;;
        "yellow") echo -e "\e[33m$2\e[0m" ;;
        *) echo "$2" ;;
    esac
}

# Display welcome message
clear
print_color "green" "=================================================="
print_color "green" "  WartaWA Installer for Linux"
print_color "green" "=================================================="
echo ""
echo "This installer will set up WartaWA on your system."
echo "You will need to provide database credentials and other configuration options."
echo ""
read -p "Press Enter to continue..."

# Check for required dependencies
echo ""
print_color "yellow" "Checking for required dependencies..."

# Check for Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "Node.js is installed: $NODE_VERSION"
else
    print_color "red" "Node.js is not installed. Please install Node.js v14 or higher."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check for npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "npm is installed: $NPM_VERSION"
else
    print_color "red" "npm is not installed. Please install npm."
    exit 1
fi

# Check for MySQL
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version)
    echo "MySQL is installed: $MYSQL_VERSION"
else
    print_color "red" "MySQL is not installed. Please install MySQL."
    echo "For Ubuntu/Debian: sudo apt install mysql-server"
    echo "For CentOS/RHEL: sudo yum install mysql-server"
    exit 1
fi

# All dependencies are installed
echo ""
print_color "green" "All required dependencies are installed."
echo ""

# Get database credentials
print_color "yellow" "Please enter your MySQL database credentials:"
read -p "MySQL Username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "MySQL Password: " DB_PASSWORD
echo ""

read -p "MySQL Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "MySQL Port (default: 3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Database Name (default: wabot): " DB_NAME
DB_NAME=${DB_NAME:-wabot}

# Get JWT Secret
echo ""
print_color "yellow" "Please enter a JWT secret key for authentication:"
read -p "JWT Secret (leave blank for auto-generated): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
    echo "Auto-generated JWT Secret: $JWT_SECRET"
fi

# Create the database
echo ""
print_color "yellow" "Creating MySQL database..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -eq 0 ]; then
    print_color "green" "Database '$DB_NAME' created successfully."
else
    print_color "red" "Failed to create database."
    exit 1
fi

# Create .env file
echo ""
print_color "yellow" "Creating environment configuration..."

cat > backend/.env << EOL
# Server Configuration
PORT=8005

# Database Configuration
DB_USER=$DB_USER
DB_HOST=$DB_HOST
DB_NAME=$DB_NAME
DB_PASSWORD=$DB_PASSWORD
DB_PORT=$DB_PORT

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# WhatsApp Configuration
WHATSAPP_SESSION_PATH=./whatsapp-sessions
EOL

print_color "green" "Environment configuration created successfully."

# Import database schema
echo ""
print_color "yellow" "Importing database schema..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" < backend/src/db/schema.sql

if [ $? -eq 0 ]; then
    print_color "green" "Database schema imported successfully."
else
    print_color "red" "Failed to import database schema."
    exit 1
fi

# Install dependencies
echo ""
print_color "yellow" "Installing backend dependencies..."
(cd backend && npm install)

if [ $? -eq 0 ]; then
    print_color "green" "Backend dependencies installed successfully."
else
    print_color "red" "Failed to install backend dependencies."
    exit 1
fi

echo ""
print_color "yellow" "Installing frontend dependencies..."
(cd frontend && npm install)

if [ $? -eq 0 ]; then
    print_color "green" "Frontend dependencies installed successfully."
else
    print_color "red" "Failed to install frontend dependencies."
    exit 1
fi

# Create start scripts
echo ""
print_color "yellow" "Creating start scripts..."

# Create start-backend.sh
cat > start-backend.sh << EOL
#!/bin/bash
cd backend
npm start
EOL
chmod +x start-backend.sh

# Create start-frontend.sh
cat > start-frontend.sh << EOL
#!/bin/bash
cd frontend
npm start
EOL
chmod +x start-frontend.sh

# Create start-all.sh
cat > start-all.sh << EOL
#!/bin/bash
echo "Starting WartaWA..."
echo ""
echo "Starting backend server..."
gnome-terminal -- ./start-backend.sh || xterm -e ./start-backend.sh || konsole -e ./start-backend.sh || ./start-backend.sh &
echo ""
echo "Starting frontend server..."
sleep 5
gnome-terminal -- ./start-frontend.sh || xterm -e ./start-frontend.sh || konsole -e ./start-frontend.sh || ./start-frontend.sh &
echo ""
echo "WartaWA is starting..."
echo "Backend will be available at: http://localhost:8005"
echo "Frontend will be available at: http://localhost:3000"
echo ""
sleep 10
xdg-open http://localhost:3000 || firefox http://localhost:3000 || google-chrome http://localhost:3000 || chromium-browser http://localhost:3000
EOL
chmod +x start-all.sh

print_color "green" "Start scripts created successfully."

# Installation complete
echo ""
print_color "green" "=================================================="
print_color "green" "  WartaWA Installation Complete!"
print_color "green" "=================================================="
echo ""
echo "To start the application:"
echo "1. Run './start-all.sh' to start both backend and frontend servers"
echo "2. Or run './start-backend.sh' and './start-frontend.sh' separately"
echo ""
echo "The application will be available at: http://localhost:3000"
echo "Default admin credentials:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
read -p "Press Enter to exit..."
