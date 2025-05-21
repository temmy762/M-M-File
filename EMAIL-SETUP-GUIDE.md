# Email Form Setup Guide

This guide helps you set up the contact form on the Memories and More Photo Booths website to send emails via SMTP without opening the Gmail app.

## What You Need

1. A Gmail account (or other email provider with SMTP access)
2. Your email address and password
3. Basic access to edit website files

## Setup Steps

### Step 1: Configure SMTP Settings

1. Open the file `email_config.php` in a text editor
2. Update the following settings with your information:
   ```php
   define('SMTP_HOST', 'smtp.gmail.com');  // Usually smtp.gmail.com for Gmail
   define('SMTP_USERNAME', 'your.email@gmail.com'); // Your full email address
   define('SMTP_PASSWORD', 'your-app-password');    // App Password (see below)
   define('SMTP_FROM', 'your.email@gmail.com');     // Usually same as username
   define('CONTACT_RECIPIENT', 'info@memoriesandmorephotobooths.com'); // Where form submissions go
   ```

### Step 2: Create a Gmail App Password (Required for Gmail)

Gmail requires an "App Password" for security. Here's how to create one:

1. Go to your Google Account at https://myaccount.google.com
2. Select "Security" in the navigation panel
3. Under "Signing in to Google," select "2-Step Verification" and enable it
4. Go back to the Security page
5. Under "Signing in to Google," select "App passwords"
6. Click "Select app" and choose "Mail"
7. Click "Select device" and choose "Other"
8. Enter "Memories and More Website" as the name and click "Generate"
9. Copy the 16-character password that appears
10. Paste this password in the `email_config.php` file for `SMTP_PASSWORD`

### Step 3: Test Your Configuration

1. Start the PHP server using `start-php-server.bat`
2. Open `email-test.html` in your web browser
3. Fill out the test form and submit it
4. Check if you receive the test email

### Step 4: Troubleshooting

If emails aren't sending:

1. Verify your App Password is correct
2. Check that the PHP server is running
3. Ensure all required PHP extensions are enabled
4. Check the "email_error_log.txt" file for specific error messages

### Common Issues and Solutions

- **Authentication Failed**: Check your username and app password
- **Connection Failed**: Make sure your hosting provider allows outbound SMTP connections
- **Timeout Error**: Your SMTP server might be blocking connections or require different settings

For Gmail accounts:
- Make sure "Less secure app access" is enabled if you're not using an App Password
- Some Google Workspace accounts have restrictions on SMTP access

## Contact for Support

If you continue to have issues, please contact: support@memoriesandmorephotobooths.com
