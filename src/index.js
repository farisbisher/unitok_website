/**
 * UniTok Web Server
 *
 * Main server application combining:
 * - Landing page and static content serving
 * - Account deletion request system with email verification
 *
 * @author UniTok Team
 * @version 2.0.0
 */

// Load environment variables first
require('dotenv').config();

// Core dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// Feature dependencies
const { v4: uuidv4 } = require('uuid');
const transporter = require('./config/email');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

console.log('UniTok Web application starting...');

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static assets (images, videos, etc.)
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// ============================================================================
// DATA DIRECTORY SETUP
// ============================================================================

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created data directory for deletion requests');
}

// ============================================================================
// HELPER FUNCTIONS - Account Deletion
// ============================================================================

/**
 * Convert deletion reason code to human-readable text
 * @param {string} reasonCode - The reason code from the form
 * @returns {string} Human-readable reason text
 */
function getReasonText(reasonCode) {
    const reasons = {
        'no-longer-needed': 'I no longer need this account',
        'privacy-concerns': 'Privacy concerns',
        'too-many-emails': 'Receiving too many emails',
        'switching-service': 'Switching to a different service',
        'difficult-to-use': 'The service is difficult to use',
        'other': 'Other reason'
    };
    return reasons[reasonCode] || reasonCode;
}

/**
 * Save deletion request to JSON file
 * @param {string} token - Unique token for this request
 * @param {Object} data - Request data to save
 */
function saveRequest(token, data) {
    const filePath = path.join(DATA_DIR, `${token}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Retrieve deletion request by token
 * @param {string} token - The unique token
 * @returns {Object|null} Request data or null if not found
 */
function getRequest(token) {
    const filePath = path.join(DATA_DIR, `${token}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
}

/**
 * Delete request file (cleanup after processing)
 * @param {string} token - The unique token
 */
function deleteRequest(token) {
    const filePath = path.join(DATA_DIR, `${token}.json`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

/**
 * Check if email has an active pending request
 * Automatically cleans up expired requests
 * @param {string} email - Email address to check
 * @returns {boolean} True if active pending request exists
 */
function hasPendingRequest(email) {
    const files = fs.readdirSync(DATA_DIR);
    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(DATA_DIR, file);
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (data.email === email && !data.confirmed) {
                    // Check if expired
                    if (isTokenExpired(data.createdAt)) {
                        // Auto-cleanup expired request
                        fs.unlinkSync(filePath);
                        console.log(`Cleaned up expired request for ${email}`);
                    } else {
                        return true; // Has active pending request
                    }
                }
            } catch (error) {
                console.error(`Error reading ${file}:`, error.message);
            }
        }
    }
    return false;
}

/**
 * Check if a token has expired based on creation timestamp
 * @param {string} createdAt - ISO timestamp of creation
 * @returns {boolean} True if expired
 */
function isTokenExpired(createdAt) {
    const expiryHours = parseInt(process.env.TOKEN_EXPIRY_HOURS) || 24;
    const expiryMs = expiryHours * 60 * 60 * 1000;
    return Date.now() - new Date(createdAt).getTime() > expiryMs;
}

// ============================================================================
// API ROUTES - Account Deletion
// ============================================================================

/**
 * POST /request-deletion
 * Submit an account deletion request
 * Validates email, creates token, saves request, sends confirmation email
 */
app.post('/request-deletion', async (req, res) => {
    try {
        const { email, reason, feedback } = req.body;

        // Validate email format
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                error: 'Please provide a valid email address.'
            });
        }

        // Validate reason is provided
        if (!reason) {
            return res.status(400).json({
                error: 'Please select a reason for deletion.'
            });
        }

        // Check for existing pending request
        if (hasPendingRequest(email)) {
            return res.status(400).json({
                error: 'You already have a pending deletion request. Please check your email for the confirmation link, or wait for it to expire before submitting a new request.'
            });
        }

        // Generate unique token
        const token = uuidv4();
        const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
        const confirmationLink = `${baseUrl}/confirm/${token}`;

        // Prepare request data
        const requestData = {
            email,
            reason,
            reasonText: getReasonText(reason),
            feedback: feedback || '',
            token,
            createdAt: new Date().toISOString(),
            confirmed: false
        };

        // Save request to file
        saveRequest(token, requestData);
        console.log(`Deletion request created for ${email} (token: ${token.substring(0, 8)}...)`);

        // Send confirmation email to user
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'UniTok Support'}" <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: 'Confirm Your UniTok Account Deletion Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1525; padding: 40px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #E5204E; font-size: 28px; margin: 0;">UniTok</h1>
                    </div>
                    <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">Account Deletion Request</h2>
                    <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                        We received a request to delete your UniTok account associated with this email address.
                    </p>
                    <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                        <strong style="color: #ffffff;">If you made this request</strong>, please click the button below to confirm:
                    </p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${confirmationLink}"
                           style="background: linear-gradient(135deg, #E5204E 0%, #ff4d78 100%); color: white; padding: 16px 40px;
                                  text-decoration: none; border-radius: 8px; display: inline-block;
                                  font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(229, 32, 78, 0.4);">
                            Confirm Account Deletion
                        </a>
                    </div>
                    <div style="background: rgba(229, 32, 78, 0.1); border-left: 4px solid #E5204E; padding: 15px 20px; border-radius: 6px; margin: 25px 0;">
                        <p style="color: #e0e0e0; font-size: 14px; margin: 0;">
                            <strong style="color: #E5204E;">Important:</strong> This link will expire in ${process.env.TOKEN_EXPIRY_HOURS || 24} hours.
                        </p>
                    </div>
                    <p style="color: #aaaaaa; font-size: 14px; line-height: 1.6;">
                        If you did not request this, you can safely ignore this email. Your UniTok account will not be deleted.
                    </p>
                    <hr style="border: none; border-top: 1px solid #3d3564; margin: 30px 0;">
                    <p style="color: #888888; font-size: 12px; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${confirmationLink}" style="color: #E5204E;">${confirmationLink}</a>
                    </p>
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3d3564;">
                        <p style="color: #666666; font-size: 12px; margin: 0;">
                            &copy; ${new Date().getFullYear()} UniTok. All rights reserved.<br>
                            <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #E5204E;">${process.env.SUPPORT_EMAIL}</a>
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);

        res.json({
            success: true,
            message: 'Confirmation email sent. Please check your inbox.'
        });

    } catch (error) {
        console.error('Error processing deletion request:', error);
        res.status(500).json({
            error: 'Failed to process your request. Please try again later.'
        });
    }
});

/**
 * GET /confirm/:token
 * Confirm a deletion request via email link
 * Validates token, marks as confirmed, sends notification to support team
 */
app.get('/confirm/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const requestData = getRequest(token);

        // Check if request exists
        if (!requestData) {
            return res.status(404).send(generateErrorPage(
                'Invalid or Expired Link',
                'This confirmation link is invalid or has already been used.',
                'If you need to delete your account, please submit a new request.',
                '/request-deletion'
            ));
        }

        // Check if token is expired
        if (isTokenExpired(requestData.createdAt)) {
            deleteRequest(token);
            console.log(`Expired token used: ${token.substring(0, 8)}...`);
            return res.status(410).send(generateErrorPage(
                'Link Expired',
                'This confirmation link has expired.',
                'Please submit a new deletion request.',
                '/request-deletion'
            ));
        }

        // Check if already confirmed (prevent double-confirmation)
        if (requestData.confirmed) {
            return res.status(410).send(generateAlreadyUsedPage());
        }

        // Mark as confirmed
        requestData.confirmed = true;
        requestData.confirmedAt = new Date().toISOString();
        saveRequest(token, requestData);
        console.log(`Deletion confirmed for ${requestData.email}`);

        // Send notification email to support team
        const supportMailOptions = {
            from: `"${process.env.FROM_NAME || 'Account Deletion System'}" <${process.env.FROM_EMAIL}>`,
            to: process.env.SUPPORT_EMAIL,
            subject: `Account Deletion Request - ${requestData.email}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Account Deletion Request</h2>
                    <p>A user has confirmed their account deletion request. Please review and process accordingly.</p>

                    <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Request Details</h3>
                        <p><strong>Email:</strong> ${requestData.email}</p>
                        <p><strong>Reason:</strong> ${requestData.reasonText}</p>
                        <p><strong>Additional Feedback:</strong> ${requestData.feedback || 'None provided'}</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
                        <p><strong>Request ID:</strong> ${token}</p>
                        <p><strong>Requested At:</strong> ${new Date(requestData.createdAt).toLocaleString()}</p>
                        <p><strong>Confirmed At:</strong> ${new Date(requestData.confirmedAt).toLocaleString()}</p>
                    </div>

                    <p style="color: #666;">
                        Please process this deletion request according to your data retention policies.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(supportMailOptions);
        console.log(`Support notification sent for ${requestData.email}`);

        // Show confirmation page
        res.sendFile(path.join(__dirname, '..', 'request-deletion', 'confirmed.html'));

    } catch (error) {
        console.error('Error confirming deletion request:', error);
        res.status(500).send(generateErrorPage(
            'Something Went Wrong',
            'We encountered an error processing your request.',
            'Please try again later or contact support.',
            '/request-deletion'
        ));
    }
});

// ============================================================================
// HTML PAGE ROUTES
// ============================================================================

/**
 * GET /request-deletion
 * Serve the account deletion request form
 */
app.get('/request-deletion', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'request-deletion', 'index.html'));
});

/**
 * GET /pp.html
 * Serve the privacy policy page
 */
app.get('/pp.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pp.html'));
});

/**
 * GET / (root)
 * Serve the landing page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ============================================================================
// UTILITY FUNCTIONS - HTML Generators
// ============================================================================

/**
 * Generate error page HTML
 * @param {string} title - Page title
 * @param {string} message - Main error message
 * @param {string} description - Additional description
 * @param {string} linkUrl - URL for action button
 * @returns {string} HTML content
 */
function generateErrorPage(title, message, description, linkUrl) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title} - UniTok</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #000000 0%, #201B40 50%, #000000 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    color: #ffffff;
                }
                .container {
                    background: #1a1525;
                    border-radius: 16px;
                    padding: 50px 40px;
                    max-width: 500px;
                    text-align: center;
                    border: 1px solid #3d3564;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                }
                .icon { font-size: 60px; margin-bottom: 20px; }
                h1 { color: #E5204E; font-size: 24px; margin-bottom: 16px; }
                p { color: #e0e0e0; margin-bottom: 12px; line-height: 1.6; }
                .btn {
                    display: inline-block;
                    padding: 14px 28px;
                    background: linear-gradient(135deg, #E5204E 0%, #ff4d78 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    margin-top: 20px;
                    transition: all 0.3s ease;
                }
                .btn:hover { box-shadow: 0 8px 25px rgba(229, 32, 78, 0.4); transform: translateY(-2px); }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">&#10007;</div>
                <h1>${title}</h1>
                <p>${message}</p>
                <p>${description}</p>
                <a href="${linkUrl}" class="btn">Submit New Request</a>
            </div>
        </body>
        </html>
    `;
}

/**
 * Generate "already used" page HTML
 * @returns {string} HTML content
 */
function generateAlreadyUsedPage() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Already Used - UniTok</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #000000 0%, #201B40 50%, #000000 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    color: #ffffff;
                }
                .container {
                    background: #1a1525;
                    border-radius: 16px;
                    padding: 50px 40px;
                    max-width: 500px;
                    text-align: center;
                    border: 1px solid #3d3564;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                }
                .icon { font-size: 60px; margin-bottom: 20px; }
                h1 { color: #E5204E; font-size: 24px; margin-bottom: 16px; }
                p { color: #e0e0e0; margin-bottom: 12px; line-height: 1.6; }
                .btn {
                    display: inline-block;
                    padding: 14px 28px;
                    background: linear-gradient(135deg, #E5204E 0%, #ff4d78 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    margin-top: 20px;
                    transition: all 0.3s ease;
                }
                .btn:hover { box-shadow: 0 8px 25px rgba(229, 32, 78, 0.4); transform: translateY(-2px); }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">&#9989;</div>
                <h1>Link Already Used</h1>
                <p>This confirmation link has already been used.</p>
                <p>Your deletion request was confirmed successfully and is being processed by our team.</p>
                <a href="https://home.unitokapp.com/" class="btn">Return to UniTok</a>
            </div>
        </body>
        </html>
    `;
}

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
    console.log(`Landing page server running on http://localhost:${PORT}`);
    console.log('Visit the URL above to see your landing page');
    console.log('\nAvailable routes:');
    console.log('  - GET  /                    → Landing page');
    console.log('  - GET  /pp.html             → Privacy policy');
    console.log('  - GET  /request-deletion    → Account deletion form');
    console.log('  - POST /request-deletion    → Submit deletion request');
    console.log('  - GET  /confirm/:token      → Confirm deletion');
    console.log('  - GET  /assets/*            → Static assets');
    console.log('\nMake sure to:');
    console.log('  1. Configure SMTP settings in .env');
    console.log('  2. Set BASE_URL for production deployment');
});
