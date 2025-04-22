const express = require("express");
const router = express.Router();

// Import controllers
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

// Import middleware
const { authenticateToken } = require("../middleware/authMiddleware");

// Auth routes
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/profile", authenticateToken, authController.getProfile);

// WhatsApp routes
router.post("/whatsapp/initialize", authenticateToken, messageController.initialize);
router.post("/whatsapp/send", authenticateToken, messageController.send);
router.get("/whatsapp/status", authenticateToken, messageController.getStatus);
router.get("/whatsapp/qr", authenticateToken, messageController.getQR);
router.get("/whatsapp/history", authenticateToken, messageController.getHistory);
router.post("/whatsapp/reset", authenticateToken, messageController.reset);

// New WhatsApp routes
router.get("/whatsapp/number-info/:number", authenticateToken, messageController.getContactInfo);
router.get("/whatsapp/groups", authenticateToken, messageController.getAllGroups);
router.get("/whatsapp/groups/:groupId", authenticateToken, messageController.getGroup);
router.get("/whatsapp/settings", authenticateToken, messageController.getAppSettings);
router.post("/whatsapp/settings", authenticateToken, messageController.updateAppSettings);

// For backward compatibility
router.post("/login", authController.login);

module.exports = router;
