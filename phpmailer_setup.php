<?php
/**
 * PHPMailer setup for Memories and More Photo Booths
 * 
 * This file downloads and sets up PHPMailer if not already installed
 */

// Define PHPMailer files
$phpmailerDir = __DIR__ . '/vendor/phpmailer';
$phpmailerSrc = $phpmailerDir . '/src';
$autoloadFile = $phpmailerSrc . '/PHPMailer.php';

// Check if PHPMailer is already installed
if (!file_exists($autoloadFile)) {
    // Create directories if they don't exist
    if (!file_exists($phpmailerDir)) {
        mkdir($phpmailerDir, 0755, true);
    }
    if (!file_exists($phpmailerSrc)) {
        mkdir($phpmailerSrc, 0755, true);
    }
    
    // URL of PHPMailer files to download
    $phpmailerFiles = [
        'PHPMailer.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/PHPMailer.php',
        'SMTP.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/SMTP.php',
        'Exception.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/Exception.php'
    ];
    
    // Download each required file
    foreach ($phpmailerFiles as $fileName => $url) {
        $fileContent = file_get_contents($url);
        if ($fileContent !== false) {
            file_put_contents($phpmailerSrc . '/' . $fileName, $fileContent);
        }
    }
}

// Check if the files were successfully downloaded
if (!file_exists($autoloadFile)) {
    throw new Exception('Failed to download PHPMailer. Please install it manually.');
}

// Include PHPMailer files
require_once $phpmailerSrc . '/Exception.php';
require_once $phpmailerSrc . '/PHPMailer.php';
require_once $phpmailerSrc . '/SMTP.php';

// Include email configuration
require_once __DIR__ . '/email_config.php';
