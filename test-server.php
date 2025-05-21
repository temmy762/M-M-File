<?php
/**
 * Test script to diagnose form submission issues
 * This script will echo back the request method and any form data received
 */

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Initialize response array
$response = array(
    'success' => true,
    'message' => 'Test server received your request.',
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => array(
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown'
    )
);

// If OPTIONS request (preflight), just return 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(json_encode($response));
}

// For POST requests, add form data to response
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response['form_data'] = $_POST;
    $response['message'] = 'POST data received successfully.';
}

// For GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $response['query_data'] = $_GET;
    $response['message'] = 'GET data received successfully.';
}

// Output the response
echo json_encode($response);
?>
