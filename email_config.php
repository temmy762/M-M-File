<?php
/**
 * Email configuration for Memories and More Photo Booths
 * 
 * This file contains SMTP configuration settings for sending emails
 * IMPORTANT: Update these values with your actual SMTP server details
 */

// SMTP Configuration
define('SMTP_HOST', 'smtp.gmail.com');  // Gmail SMTP server
define('SMTP_PORT', 587);               // TLS port for Gmail

// Gmail address for sending emails
define('SMTP_USERNAME', 'temmylayo817@gmail.com'); // Your Gmail address

// App Password generated for 'Memories and More Website'
define('SMTP_PASSWORD', 'obkjusjpzpycqdwk');    // Gmail App Password (16 characters, no spaces)

// Using the same email as the sender
define('SMTP_FROM', 'temmylayo817@gmail.com');     // Sender email address (same as username)

// You can customize this name if you want
define('SMTP_FROM_NAME', 'Memories and More Photo Booths'); // Sender name

// Recipient configuration
define('CONTACT_RECIPIENT', 'info@memoriesandmorephotobooths.com'); // Primary recipient for contact form
define('INQUIRE_RECIPIENT', 'info@memoriesandmorephotobooths.com'); // Primary recipient for inquire form
define('ADMIN_BCC', '');  // BCC email for admin (optional)

/**
 * IMPORTANT NOTE ABOUT GMAIL:
 * 
 * If you're using Gmail, you need to:
 * 1. Enable 2-Step Verification on your Google account at https://myaccount.google.com/security
 * 2. Generate an App Password specifically for this website at https://myaccount.google.com/apppasswords
 * 3. Use that App Password above instead of your regular Gmail password
 * 4. The App Password is a 16-character code with no spaces
 * 
 * This setup allows your forms to send emails directly through Gmail's servers
 * without requiring users to open their email clients.
 */
