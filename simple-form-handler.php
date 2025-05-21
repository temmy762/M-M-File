<?php
/**
 * Simple Form Handler for Memories and More Photo Booths
 * Processes form submissions and sends email notifications via SMTP
 */

// Include PHPMailer setup
try {
    require_once __DIR__ . '/phpmailer_setup.php';
} catch (Exception $e) {
    // If PHPMailer setup fails, we'll handle this later
}

// Set headers for AJAX response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS requests (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Initialize response
$response = [
    'success' => false,
    'message' => 'An error occurred while processing your request.'
];

// Check for configuration status request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['check']) && $_GET['check'] === 'config') {
    checkEmailConfiguration();
    exit;
}

// Only process POST requests for form submissions
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method. Only POST requests are allowed for form submissions.';
    echo json_encode($response);
    exit;
}

try {
    // Get form type
    $formType = isset($_POST['form_type']) ? sanitizeInput($_POST['form_type']) : 'unknown';
    
    if ($formType === 'contact') {
        // Process contact form
        processContactForm();
    } else {
        // Unknown form type
        $response['message'] = 'Unknown form type.';
    }
} catch (Exception $e) {
    $response['message'] = 'Server error: ' . $e->getMessage();
}

// Send JSON response
echo json_encode($response);
exit;

/**
 * Process contact form submission
 */
function processContactForm() {
    global $response;
    
    // Required fields
    $requiredFields = ['name', 'email', 'subject', 'message'];
    
    // Validate required fields
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            $response['message'] = "Missing required field: $field";
            return;
        }
    }
    
    // Validate email
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address.';
        return;
    }
    
    // Get form data
    $name = sanitizeInput($_POST['name']);
    $email = sanitizeInput($_POST['email']);
    $phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : 'Not provided';
    $subject = sanitizeInput($_POST['subject']);
    $message = sanitizeInput($_POST['message']);
    
    // Format email
    $to = defined('CONTACT_RECIPIENT') ? CONTACT_RECIPIENT : 'info@memoriesandmorephotobooths.com';
    $emailSubject = "Website Contact: $subject";
    
    // Create nicely formatted email body
    $emailBody = "You've received a new contact form submission from your website:\n\n";
    $emailBody .= "Name: $name\n";
    $emailBody .= "Email: $email\n";
    $emailBody .= "Phone: $phone\n";
    $emailBody .= "Subject: $subject\n\n";
    $emailBody .= "Message:\n$message\n\n";
    $emailBody .= "Sent from: Memories and More Photo Booths website contact form\n";
    $emailBody .= "Date/Time: " . date('Y-m-d H:i:s') . "\n";
    
    // Send email
    if (sendEmail($to, $emailSubject, $emailBody, $email)) {
        $response['success'] = true;
        $response['message'] = 'Your message has been sent successfully.';
    } else {
        $response['message'] = 'Failed to send email. Please try again later.';
        
        // Add diagnostics for troubleshooting
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $response['debug'] = error_get_last();
        }
    }
}

/**
 * Send email using PHPMailer
 * 
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $message Email body
 * @param string $replyToEmail Reply-to email address
 * @return bool Whether email was sent
 */
function sendEmail($to, $subject, $message, $replyToEmail = '') {
    // Detect if running on localhost
    $isLocalDev = strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false ||
                  strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1') !== false;
    
    if ($isLocalDev) {
        // Log email instead of sending it in development
        $log = "[" . date('Y-m-d H:i:s') . "] Email would be sent:\n";
        $log .= "To: $to\n";
        $log .= "Subject: $subject\n";
        $log .= "Reply-To: $replyToEmail\n";
        $log .= "Message: $message\n\n";
        
        file_put_contents('email_log.txt', $log, FILE_APPEND);
        
        return true; // Always return success in development
    } else {
        // Use PHPMailer in production
        try {
            // Create a new PHPMailer instance
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USERNAME;
            $mail->Password   = SMTP_PASSWORD;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = SMTP_PORT;
            
            // Sender and recipient
            $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
            $mail->addAddress($to);
            
            // Add reply-to if provided
            if (!empty($replyToEmail)) {
                $mail->addReplyTo($replyToEmail);
            }
            
            // Add BCC for admin if configured
            if (defined('ADMIN_BCC') && !empty(ADMIN_BCC)) {
                $mail->addBCC(ADMIN_BCC);
            }
            
            // Content
            $mail->isHTML(false);
            $mail->Subject = $subject;
            $mail->Body    = $message;
            
            // Send the email
            return $mail->send();
        } catch (Exception $e) {
            // Log the error
            file_put_contents('email_error_log.txt', 
                "[" . date('Y-m-d H:i:s') . "] Mailer Error: " . $e->getMessage() . "\n", 
                FILE_APPEND);
            return false;
        }
    }
}

/**
 * Sanitize user input
 * 
 * @param string $data User input
 * @return string Sanitized data
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Check email configuration status
 * Outputs JSON response with configuration status
 */
function checkEmailConfiguration() {
    $response = [
        'config_status' => false,
        'message' => 'Could not verify email configuration.'
    ];
    
    // Check if email_config.php exists and has required constants
    $configFile = __DIR__ . '/email_config.php';
    if (!file_exists($configFile)) {
        $response['message'] = 'Email configuration file is missing. Please create email_config.php with your SMTP settings.';
        echo json_encode($response);
        return;
    }
    
    // Check if required constants are defined
    $requiredConstants = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM', 'CONTACT_RECIPIENT'];
    $missingConstants = [];
    
    // Check each constant
    foreach ($requiredConstants as $constant) {
        if (!defined($constant) || empty(constant($constant)) || constant($constant) === 'your.email@gmail.com') {
            $missingConstants[] = $constant;
        }
    }
    
    if (!empty($missingConstants)) {
        $response['message'] = 'Email configuration is incomplete. Missing or default values for: ' . 
                               implode(', ', $missingConstants) . 
                               '. Please update email_config.php with your actual SMTP settings.';
    } else {
        $response['config_status'] = true;
        $response['message'] = 'Email configuration appears to be set up correctly. SMTP server: ' . SMTP_HOST . 
                              ', From: ' . SMTP_FROM . ', To: ' . CONTACT_RECIPIENT;
    }
    
    // Check if PHPMailer files exist
    $phpmailerPath = __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
    if (!file_exists($phpmailerPath)) {
        $response['config_status'] = false;
        $response['message'] .= ' WARNING: PHPMailer files not found. They will be automatically downloaded when sending the first email.';
    }
    
    echo json_encode($response);
}
