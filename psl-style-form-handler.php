<?php
/**
 * Memories and More Photo Booths - Form Handler
 * 
 * Simple PHP script to handle form submissions from the website
 * Upload this file to the root directory of your hosting
 */

// Configuration
$config = [
    'admin_email' => 'info@memoriesandmorephotobooths.com',
    'from_email' => 'info@memoriesandmorephotobooths.com',
    'subject_prefix' => 'Memories and More Website: ',
    'success_page' => 'thank-you.html',
    'error_page' => 'error.html',
    'allowed_forms' => [
        'contact' => [
            'fields' => ['name', 'email', 'phone', 'subject', 'message'],
            'required' => ['name', 'email', 'subject', 'message'],
            'subject' => 'New Contact Form Submission'
        ],
        'inquire' => [
            'fields' => ['firstName', 'lastName', 'email', 'phone', 'eventDate', 'eventTime', 'eventDuration', 'eventLocation', 'guestCount', 'eventType', 'package', 'addons', 'backdrop', 'hearAbout', 'message'],
            'required' => ['firstName', 'lastName', 'email', 'phone', 'eventDate', 'eventType'],
            'subject' => 'New Booking Inquiry'
        ]
    ]
];

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 403 Forbidden');
    exit('Direct access forbidden.');
}

// Determine which form was submitted
$form_type = isset($_POST['form_type']) ? $_POST['form_type'] : 'contact';

// Validate form type
if (!array_key_exists($form_type, $config['allowed_forms'])) {
    redirect_with_error('Invalid form submission.');
}

// Get form configuration
$form_config = $config['allowed_forms'][$form_type];

// Collect and validate form data
$form_data = [];
$errors = [];

// Check required fields
foreach ($form_config['required'] as $field) {
    if (empty($_POST[$field])) {
        $errors[] = "Field '$field' is required.";
    }
}

// If no errors, proceed with collecting all form data
if (empty($errors)) {
    foreach ($form_config['fields'] as $field) {
        if (isset($_POST[$field])) {
            $form_data[$field] = htmlspecialchars($_POST[$field]);
        }
    }
    
    // For inquire form, combine first and last name
    if ($form_type === 'inquire' && isset($form_data['firstName']) && isset($form_data['lastName'])) {
        $form_data['name'] = $form_data['firstName'] . ' ' . $form_data['lastName'];
    }
    
    // Handle arrays for addons
    if ($form_type === 'inquire' && isset($_POST['addons']) && is_array($_POST['addons'])) {
        $form_data['addons'] = implode(', ', array_map('htmlspecialchars', $_POST['addons']));
    }
}

// If validation passed, process the form
if (empty($errors)) {
    // Prepare email
    $subject = $config['subject_prefix'] . $form_config['subject'];
    
    // Add event type and date to subject for inquire form
    if ($form_type === 'inquire' && isset($form_data['eventType']) && isset($form_data['eventDate'])) {
        $subject .= ': ' . $form_data['eventType'] . ' on ' . $form_data['eventDate'];
    }
    
    $message = build_email_message($form_data, $form_type);
    $headers = [
        'From: ' . $config['from_email'],
        'Reply-To: ' . $form_data['email'],
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/html; charset=UTF-8'
    ];
    
    // Send email
    $mail_success = mail(
        $config['admin_email'], 
        $subject, 
        $message, 
        implode("\r\n", $headers)
    );
    
    if ($mail_success) {
        // Redirect to thank you page
        header('Location: ' . $config['success_page']);
        exit;
    } else {
        redirect_with_error('Failed to send email. Please try again later.');
    }
} else {
    // Redirect with errors
    redirect_with_error(implode(' ', $errors));
}

/**
 * Build email message from form data
 */
function build_email_message($data, $form_type) {
    $html = '<html><body>';
    
    if ($form_type === 'contact') {
        $html .= '<h1>New Contact Form Submission</h1>';
        $html .= '<table style="width: 100%; border-collapse: collapse;">';
        
        foreach ($data as $key => $value) {
            // Format field name for display
            $field_name = ucwords(str_replace('_', ' ', $key));
            
            $html .= '<tr>';
            $html .= '<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">' . $field_name . '</td>';
            $html .= '<td style="padding: 8px; border: 1px solid #ddd;">' . nl2br($value) . '</td>';
            $html .= '</tr>';
        }
    } else if ($form_type === 'inquire') {
        $html .= '<h1>New Booking Inquiry</h1>';
        
        // Contact Information
        $html .= '<h2>Contact Information</h2>';
        $html .= '<table style="width: 100%; border-collapse: collapse;">';
        
        $contact_fields = ['name', 'email', 'phone', 'hearAbout'];
        foreach ($contact_fields as $field) {
            if (isset($data[$field])) {
                $field_name = ucwords(str_replace(['_', 'hear', 'about'], [' ', 'Hear ', 'About'], $field));
                
                $html .= '<tr>';
                $html .= '<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">' . $field_name . '</td>';
                $html .= '<td style="padding: 8px; border: 1px solid #ddd;">' . nl2br($data[$field]) . '</td>';
                $html .= '</tr>';
            }
        }
        $html .= '</table>';
        
        // Event Details
        $html .= '<h2>Event Details</h2>';
        $html .= '<table style="width: 100%; border-collapse: collapse;">';
        
        $event_fields = ['eventType', 'eventDate', 'eventTime', 'eventDuration', 'eventLocation', 'guestCount'];
        foreach ($event_fields as $field) {
            if (isset($data[$field])) {
                $field_name = ucwords(str_replace(['event', '_'], ['Event ', ' '], $field));
                
                $html .= '<tr>';
                $html .= '<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">' . $field_name . '</td>';
                $html .= '<td style="padding: 8px; border: 1px solid #ddd;">' . nl2br($data[$field]) . '</td>';
                $html .= '</tr>';
            }
        }
        $html .= '</table>';
        
        // Package Information
        $html .= '<h2>Package Information</h2>';
        $html .= '<table style="width: 100%; border-collapse: collapse;">';
        
        $package_fields = ['package', 'addons', 'backdrop'];
        foreach ($package_fields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                $field_name = ucwords($field);
                
                $html .= '<tr>';
                $html .= '<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">' . $field_name . '</td>';
                $html .= '<td style="padding: 8px; border: 1px solid #ddd;">' . nl2br($data[$field]) . '</td>';
                $html .= '</tr>';
            }
        }
        $html .= '</table>';
        
        // Additional Information
        if (isset($data['message']) && !empty($data['message'])) {
            $html .= '<h2>Additional Information</h2>';
            $html .= '<table style="width: 100%; border-collapse: collapse;">';
            $html .= '<tr>';
            $html .= '<td style="padding: 8px; border: 1px solid #ddd;">' . nl2br($data['message']) . '</td>';
            $html .= '</tr>';
            $html .= '</table>';
        }
    }
    
    $html .= '</table>';
    $html .= '<p style="margin-top: 20px;">This email was sent from the Memories and More Photo Booths website form at ' . date('Y-m-d H:i:s') . '</p>';
    $html .= '</body></html>';
    
    return $html;
}

/**
 * Redirect with error message
 */
function redirect_with_error($error) {
    // Store error in session
    session_start();
    $_SESSION['form_error'] = $error;
    
    // Redirect to error page
    header('Location: ' . $GLOBALS['config']['error_page']);
    exit;
}
?>
