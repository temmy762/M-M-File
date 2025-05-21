<?php
/**
 * Memories and More Photo Booths - Form Handler
 * This script processes form submissions from contact.html and inquire.html
 * using PHPMailer to send emails through Gmail SMTP
 */

// Set headers to prevent caching and allow CORS
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Initialize response array
$response = array(
    'success' => false,
    'message' => 'An error occurred while processing your request.'
);

// Include PHPMailer setup
try {
    require_once __DIR__ . '/phpmailer_setup.php';
    
    // Create a new PHPMailer instance
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    // Configure PHPMailer with SMTP settings
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = 'tls';
    $mail->Port = SMTP_PORT;
    $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
    
    // Set email format to HTML
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    
} catch (Exception $e) {
    $response['message'] = 'Error setting up email system: ' . $e->getMessage();
    echo json_encode($response);
    exit;
}

/**
 * Sanitize user input
 * @param string $data Input data to sanitize
 * @return string Sanitized data
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email format
 * @param string $email Email to validate
 * @return bool Whether email is valid
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate required fields
 * @param array $fields Array of field names to check
 * @param array $data Data array to check against
 * @return array [isValid, missingFields]
 */
function validateRequiredFields($fields, $data) {
    $missingFields = [];
    
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $missingFields[] = $field;
        }
    }
    
    return [
        'isValid' => empty($missingFields),
        'missingFields' => $missingFields
    ];
}

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form type (contact or inquire)
    $formType = isset($_POST['form_type']) ? sanitizeInput($_POST['form_type']) : 'unknown';
    
    // Process test form
    if ($formType === 'test') {
        // Define required fields
        $requiredFields = ['name', 'email', 'message'];
        
        // Validate required fields
        $validation = validateRequiredFields($requiredFields, $_POST);
        if (!$validation['isValid']) {
            $response['success'] = false;
            $response['message'] = 'Please fill in all required fields: ' . implode(', ', $validation['missingFields']);
            echo json_encode($response);
            exit;
        }
        
        // Get and sanitize form data
        $name = sanitizeInput($_POST['name']);
        $email = sanitizeInput($_POST['email']);
        $messageContent = sanitizeInput($_POST['message']);
        
        // Validate email format
        if (!isValidEmail($email)) {
            $response['success'] = false;
            $response['message'] = 'Please enter a valid email address.';
            echo json_encode($response);
            exit;
        }
        
        try {
            // Reset all recipients
            $mail->clearAddresses();
            $mail->clearCCs();
            $mail->clearBCCs();
            
            // Set email recipient
            $mail->addAddress(CONTACT_RECIPIENT);
            
            // Set reply-to address
            $mail->addReplyTo($email, $name);
            
            // Set email subject
            $mail->Subject = 'Test Form Submission';
            
            // Create email body
            $emailBody = "<h2>Test Form Submission</h2>";
            $emailBody .= "<p><strong>Name:</strong> " . $name . "</p>";
            $emailBody .= "<p><strong>Email:</strong> " . $email . "</p>";
            $emailBody .= "<p><strong>Message:</strong></p>";
            $emailBody .= "<p>" . nl2br($messageContent) . "</p>";
            
            // Set email body
            $mail->Body = $emailBody;
            $mail->AltBody = strip_tags(str_replace('<br>', "\n", $emailBody));
            
            // Send email
            $mail->send();
            
            $response['success'] = true;
            $response['message'] = 'Your test message has been sent successfully!';
        } catch (Exception $e) {
            $response['success'] = false;
            $response['message'] = 'Error sending email: ' . $mail->ErrorInfo;
        }
        
        echo json_encode($response);
        exit;
    }
    
    // Process contact form
    if ($formType === 'contact') {
        // Define required fields
        $requiredFields = ['name', 'email', 'subject', 'message'];
        
        // Validate required fields
        $validation = validateRequiredFields($requiredFields, $_POST);
        if (!$validation['isValid']) {
            $response['success'] = false;
            $response['message'] = 'Please fill in all required fields: ' . implode(', ', $validation['missingFields']);
            echo json_encode($response);
            exit;
        }
        
        // Get and sanitize form data
        $name = sanitizeInput($_POST['name']);
        $email = sanitizeInput($_POST['email']);
        $phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : 'Not provided';
        $subject = sanitizeInput($_POST['subject']);
        $messageContent = sanitizeInput($_POST['message']);
        
        // Validate email format
        if (!isValidEmail($email)) {
            $response['success'] = false;
            $response['message'] = 'Please enter a valid email address.';
            echo json_encode($response);
            exit;
        }
        
        try {
            // Reset all recipients
            $mail->clearAddresses();
            $mail->clearCCs();
            $mail->clearBCCs();
            
            // Set email recipient
            $mail->addAddress(CONTACT_RECIPIENT);
            
            // Add BCC if configured
            if (!empty(ADMIN_BCC)) {
                $mail->addBCC(ADMIN_BCC);
            }
            
            // Set reply-to address
            $mail->addReplyTo($email, $name);
            
            // Set email subject
            $mail->Subject = 'Contact Form: ' . $subject;
            
            // Create email body
            $emailBody = "<h2>Contact Form Submission</h2>";
            $emailBody .= "<p><strong>Name:</strong> " . $name . "</p>";
            $emailBody .= "<p><strong>Email:</strong> " . $email . "</p>";
            $emailBody .= "<p><strong>Phone:</strong> " . $phone . "</p>";
            $emailBody .= "<p><strong>Subject:</strong> " . $subject . "</p>";
            $emailBody .= "<p><strong>Message:</strong></p>";
            $emailBody .= "<p>" . nl2br($messageContent) . "</p>";
            
            // Set email body
            $mail->Body = $emailBody;
            $mail->AltBody = strip_tags(str_replace('<br>', "\n", $emailBody));
            
            // Send email
            $mail->send();
            
            $response['success'] = true;
            $response['message'] = 'Your message has been sent successfully!';
        } catch (Exception $e) {
            $response['success'] = false;
            $response['message'] = 'Error sending email: ' . $mail->ErrorInfo;
        }
        
        echo json_encode($response);
        exit;
    }
    
    // Process inquire form
    else if ($formType === 'inquire') {
        // Define required fields for the inquire form 
        $requiredFields = ['name', 'email', 'phone', 'event_date', 'event_type'];
        
        // Validate required fields
        $validation = validateRequiredFields($requiredFields, $_POST);
        if (!$validation['isValid']) {
            $response['success'] = false;
            $response['message'] = 'Please fill in all required fields: ' . implode(', ', $validation['missingFields']);
            echo json_encode($response);
            exit;
        }
        
        // Get and sanitize form data
        $name = sanitizeInput($_POST['name']);
        $email = sanitizeInput($_POST['email']);
        $phone = sanitizeInput($_POST['phone']);
        $eventDate = sanitizeInput($_POST['event_date']);
        $eventType = sanitizeInput($_POST['event_type']);
        $eventLocation = isset($_POST['event_location']) ? sanitizeInput($_POST['event_location']) : 'Not provided';
        $eventGuests = isset($_POST['event_guests']) ? sanitizeInput($_POST['event_guests']) : 'Not provided';
        $eventHours = isset($_POST['event_hours']) ? sanitizeInput($_POST['event_hours']) : 'Not provided';
        $packageType = isset($_POST['package_type']) ? sanitizeInput($_POST['package_type']) : 'Not specified';
        $additionalInfo = isset($_POST['additional_info']) ? sanitizeInput($_POST['additional_info']) : '';
        
        // Validate email format
        if (!isValidEmail($email)) {
            $response['success'] = false;
            $response['message'] = 'Please enter a valid email address.';
            echo json_encode($response);
            exit;
        }
        
        try {
            // Reset all recipients
            $mail->clearAddresses();
            $mail->clearCCs();
            $mail->clearBCCs();
            
            // Set email recipient
            $mail->addAddress(INQUIRE_RECIPIENT);
            
            // Add BCC if configured
            if (!empty(ADMIN_BCC)) {
                $mail->addBCC(ADMIN_BCC);
            }
            
            // Set reply-to address
            $mail->addReplyTo($email, $name);
            
            // Set email subject
            $mail->Subject = 'New Quote Request: ' . $eventType . ' on ' . $eventDate;
            
            // Create email body
            $emailBody = "<h2>Quote Request Form Submission</h2>";
            
            $emailBody .= "<h3>Contact Information</h3>";
            $emailBody .= "<p><strong>Name:</strong> " . $name . "</p>";
            $emailBody .= "<p><strong>Email:</strong> " . $email . "</p>";
            $emailBody .= "<p><strong>Phone:</strong> " . $phone . "</p>";
            
            $emailBody .= "<h3>Event Details</h3>";
            $emailBody .= "<p><strong>Event Date:</strong> " . $eventDate . "</p>";
            $emailBody .= "<p><strong>Event Type:</strong> " . $eventType . "</p>";
            $emailBody .= "<p><strong>Event Location:</strong> " . $eventLocation . "</p>";
            $emailBody .= "<p><strong>Expected Guests:</strong> " . $eventGuests . "</p>";
            $emailBody .= "<p><strong>Hours Needed:</strong> " . $eventHours . "</p>";
            
            $emailBody .= "<h3>Package Information</h3>";
            $emailBody .= "<p><strong>Preferred Package:</strong> " . $packageType . "</p>";
            
            if (!empty($additionalInfo)) {
                $emailBody .= "<h3>Additional Information</h3>";
                $emailBody .= "<p>" . nl2br($additionalInfo) . "</p>";
            }
            
            // Set email body
            $mail->Body = $emailBody;
            $mail->AltBody = strip_tags(str_replace('<br>', "\n", $emailBody));
            
            // Send email
            $mail->send();
            
            $response['success'] = true;
            $response['message'] = 'Your quote request has been sent successfully! We will contact you shortly.';
        } catch (Exception $e) {
            $response['success'] = false;
            $response['message'] = 'Error sending email: ' . $mail->ErrorInfo;
        }
        
        echo json_encode($response);
        exit;
    }
}

// Return the response as JSON
echo json_encode($response);
?>
