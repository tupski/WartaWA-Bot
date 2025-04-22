# WartaWA Installer
# This script will install and configure WartaWA

# Function to display colored text
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Display welcome message
Clear-Host
Write-ColorOutput Green "=================================================="
Write-ColorOutput Green "  WartaWA Installer"
Write-ColorOutput Green "=================================================="
Write-Output ""
Write-Output "This installer will set up WartaWA on your system."
Write-Output "You will need to provide database credentials and other configuration options."
Write-Output ""
Write-Output "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Check for required dependencies
Write-Output ""
Write-ColorOutput Yellow "Checking for required dependencies..."

# Check for Node.js
$nodeInstalled = $false
try {
    $nodeVersion = node -v
    $nodeInstalled = $true
    Write-Output "Node.js is installed: $nodeVersion"
} catch {
    Write-ColorOutput Red "Node.js is not installed. Please install Node.js v14 or higher."
    Write-Output "Download from: https://nodejs.org/"
    exit 1
}

# Check for npm
$npmInstalled = $false
try {
    $npmVersion = npm -v
    $npmInstalled = $true
    Write-Output "npm is installed: $npmVersion"
} catch {
    Write-ColorOutput Red "npm is not installed. Please install npm."
    exit 1
}

# Check for MySQL
$mysqlInstalled = $false
try {
    $mysqlVersion = mysql --version
    $mysqlInstalled = $true
    Write-Output "MySQL is installed: $mysqlVersion"
} catch {
    Write-ColorOutput Red "MySQL is not installed. Please install MySQL."
    Write-Output "Download from: https://dev.mysql.com/downloads/installer/"
    exit 1
}

# All dependencies are installed
Write-Output ""
Write-ColorOutput Green "All required dependencies are installed."
Write-Output ""

# Get database credentials
Write-ColorOutput Yellow "Please enter your MySQL database credentials:"
$dbUser = Read-Host "MySQL Username (default: root)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "root"
}

$dbPassword = Read-Host "MySQL Password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
$dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$dbHost = Read-Host "MySQL Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) {
    $dbHost = "localhost"
}

$dbPort = Read-Host "MySQL Port (default: 3306)"
if ([string]::IsNullOrWhiteSpace($dbPort)) {
    $dbPort = "3306"
}

$dbName = Read-Host "Database Name (default: wabot)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "wabot"
}

# Get JWT Secret
Write-Output ""
Write-ColorOutput Yellow "Please enter a JWT secret key for authentication:"
$jwtSecret = Read-Host "JWT Secret (leave blank for auto-generated)"
if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    $jwtSecret = [System.Guid]::NewGuid().ToString()
    Write-Output "Auto-generated JWT Secret: $jwtSecret"
}

# Create the database
Write-Output ""
Write-ColorOutput Yellow "Creating MySQL database..."
try {
    # Create a temporary SQL file
    $tempSqlFile = [System.IO.Path]::GetTempFileName()
    "CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | Out-File -FilePath $tempSqlFile -Encoding ASCII

    # Execute the SQL command
    mysql -u $dbUser -p"$dbPasswordPlain" -h $dbHost -P $dbPort -e "source $tempSqlFile"

    # Remove the temporary file
    Remove-Item $tempSqlFile

    Write-ColorOutput Green "Database '$dbName' created successfully."
} catch {
    Write-ColorOutput Red "Failed to create database: $_"
    exit 1
}

# Create .env file
Write-Output ""
Write-ColorOutput Yellow "Creating environment configuration..."

$envContent = @"
# Server Configuration
PORT=8005

# Database Configuration
DB_USER=$dbUser
DB_HOST=$dbHost
DB_NAME=$dbName
DB_PASSWORD=$dbPasswordPlain
DB_PORT=$dbPort

# JWT Configuration
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# WhatsApp Configuration
WHATSAPP_SESSION_PATH=./whatsapp-sessions
"@

# Write to .env file in backend directory
$envContent | Out-File -FilePath "backend/.env" -Encoding ASCII
Write-ColorOutput Green "Environment configuration created successfully."

# Import database schema
Write-Output ""
Write-ColorOutput Yellow "Importing database schema..."
try {
    mysql -u $dbUser -p"$dbPasswordPlain" -h $dbHost -P $dbPort $dbName < "backend/src/db/schema.sql"
    Write-ColorOutput Green "Database schema imported successfully."
} catch {
    Write-ColorOutput Red "Failed to import database schema: $_"
    exit 1
}

# Install dependencies
Write-Output ""
Write-ColorOutput Yellow "Installing backend dependencies..."
try {
    Set-Location -Path "backend"
    npm install
    Set-Location -Path ".."
    Write-ColorOutput Green "Backend dependencies installed successfully."
} catch {
    Write-ColorOutput Red "Failed to install backend dependencies: $_"
    exit 1
}

Write-Output ""
Write-ColorOutput Yellow "Installing frontend dependencies..."
try {
    Set-Location -Path "frontend"
    npm install
    Set-Location -Path ".."
    Write-ColorOutput Green "Frontend dependencies installed successfully."
} catch {
    Write-ColorOutput Red "Failed to install frontend dependencies: $_"
    exit 1
}

# Create start scripts
Write-Output ""
Write-ColorOutput Yellow "Creating start scripts..."

# Create start-backend.bat
@"
@echo off
cd backend
npm start
"@ | Out-File -FilePath "start-backend.bat" -Encoding ASCII

# Create start-frontend.bat
@"
@echo off
cd frontend
npm start
"@ | Out-File -FilePath "start-frontend.bat" -Encoding ASCII

# Create start-all.bat
@"
@echo off
echo Starting WartaWA...
echo.
echo Starting backend server...
start cmd /k "start-backend.bat"
echo.
echo Starting frontend server...
timeout /t 5 /nobreak > nul
start cmd /k "start-frontend.bat"
echo.
echo WartaWA is starting...
echo Backend will be available at: http://localhost:8005
echo Frontend will be available at: http://localhost:3000
echo.
timeout /t 10 /nobreak > nul
start http://localhost:3000
"@ | Out-File -FilePath "start-all.bat" -Encoding ASCII

Write-ColorOutput Green "Start scripts created successfully."

# Installation complete
Write-Output ""
Write-ColorOutput Green "=================================================="
Write-ColorOutput Green "  WartaWA Installation Complete!"
Write-ColorOutput Green "=================================================="
Write-Output ""
Write-Output "To start the application:"
Write-Output "1. Run 'start-all.bat' to start both backend and frontend servers"
Write-Output "2. Or run 'start-backend.bat' and 'start-frontend.bat' separately"
Write-Output ""
Write-Output "The application will be available at: http://localhost:3000"
Write-Output "Default admin credentials:"
Write-Output "  Email: admin@example.com"
Write-Output "  Password: admin123"
Write-Output ""
Write-Output "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
