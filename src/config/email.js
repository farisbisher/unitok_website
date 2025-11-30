/**
 * Email Configuration Module
 *
 * Configures and exports a Nodemailer transporter for sending emails.
 * Used for account deletion confirmations and support notifications.
 *
 * @requires nodemailer
 * @requires dotenv
 */

const nodemailer = require('nodemailer');

/**
 * Create and configure email transporter
 * Uses SMTP settings from environment variables
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Verify transporter configuration on startup
 * Logs connection status but doesn't prevent server from starting
 */
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error.message);
        console.error('Please check your SMTP settings in .env file');
    } else {
        console.log('Email server ready to send messages');
    }
});

module.exports = transporter;
