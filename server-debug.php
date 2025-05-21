<?php
/**
 * Web Server Environment Debugger
 * This script analyzes your web server configuration and helps diagnose form submission issues
 */

// Set proper content type
header('Content-Type: text/html; charset=UTF-8');

// Function to check if a feature is available
function checkFeature($feature, $checkFunction) {
    echo "<tr>";
    echo "<td>" . $feature . "</td>";
    $result = $checkFunction();
    if ($result === true) {
        echo "<td class='success'>Available</td>";
        echo "<td>✓</td>";
    } else if ($result === false) {
        echo "<td class='error'>Not Available</td>";
        echo "<td>✗</td>";
    } else {
        echo "<td class='warning'>" . $result . "</td>";
        echo "<td>⚠</td>";
    }
    echo "</tr>";
}

// Get server information
$serverInfo = [
    'PHP Version' => phpversion(),
    'Web Server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'Server API' => php_sapi_name(),
    'HTTP Method Support' => implode(', ', $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ?? ['GET', 'POST']),
];

// Get PHP configuration
$phpConfig = [
    'max_execution_time' => ini_get('max_execution_time') . ' seconds',
    'memory_limit' => ini_get('memory_limit'),
    'post_max_size' => ini_get('post_max_size'),
    'file_uploads' => ini_get('file_uploads') ? 'Enabled' : 'Disabled',
    'max_file_uploads' => ini_get('max_file_uploads'),
    'upload_max_filesize' => ini_get('upload_max_filesize'),
];

// Mail configuration
$mailConfig = [
    'SMTP' => ini_get('SMTP'),
    'smtp_port' => ini_get('smtp_port'),
    'sendmail_from' => ini_get('sendmail_from'),
    'mail function' => function_exists('mail') ? 'Available' : 'Not Available',
];

// Test POST request
$postTestResult = null;
if (isset($_POST['test_post']) && $_POST['test_post'] === 'true') {
    $postTestResult = [
        'status' => 'success',
        'message' => 'POST request received successfully',
        'data' => $_POST
    ];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Server Environment Debugger</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 {
            color: #444;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
        .warning {
            color: orange;
        }
        .note {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .test-area {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Web Server Environment Debugger</h1>
        <p>Use this tool to diagnose issues with form submissions and server configuration.</p>
        
        <div class="note">
            <strong>Note:</strong> This file provides diagnostic information about your server environment.
            For security reasons, you should remove it from your production server after troubleshooting.
        </div>
        
        <h2>Server Information</h2>
        <table>
            <tr>
                <th>Setting</th>
                <th>Value</th>
            </tr>
            <?php foreach ($serverInfo as $key => $value): ?>
            <tr>
                <td><?php echo $key; ?></td>
                <td><?php echo $value; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
        
        <h2>PHP Configuration</h2>
        <table>
            <tr>
                <th>Setting</th>
                <th>Value</th>
            </tr>
            <?php foreach ($phpConfig as $key => $value): ?>
            <tr>
                <td><?php echo $key; ?></td>
                <td><?php echo $value; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
        
        <h2>Mail Configuration</h2>
        <table>
            <tr>
                <th>Setting</th>
                <th>Value</th>
            </tr>
            <?php foreach ($mailConfig as $key => $value): ?>
            <tr>
                <td><?php echo $key; ?></td>
                <td><?php echo is_string($value) ? $value : ($value ? 'Available' : 'Not Available'); ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
        
        <h2>Feature Availability</h2>
        <table>
            <tr>
                <th>Feature</th>
                <th>Status</th>
                <th></th>
            </tr>
            <?php
            checkFeature('Mail Function', function() { 
                return function_exists('mail'); 
            });
            
            checkFeature('cURL Extension', function() { 
                return function_exists('curl_version'); 
            });
            
            checkFeature('JSON Functions', function() { 
                return function_exists('json_encode') && function_exists('json_decode'); 
            });
            
            checkFeature('POST Request Handling', function() { 
                return $_SERVER['REQUEST_METHOD'] === 'POST' ? true : 'Not tested (make a POST request)'; 
            });
            
            checkFeature('File Uploads', function() { 
                return ini_get('file_uploads') ? true : false; 
            });
            ?>
        </table>
        
        <h2>HTTP Method Testing</h2>
        <div class="test-area">
            <h3>Test POST Request</h3>
            <form method="post" action="">
                <input type="hidden" name="test_post" value="true">
                <input type="text" name="test_data" placeholder="Enter some test data" value="Test data">
                <button type="submit">Submit POST Test</button>
            </form>
            
            <?php if ($postTestResult): ?>
            <div class="result" style="margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 5px;">
                <strong>Success!</strong> POST request was processed correctly.
                <pre><?php echo json_encode($postTestResult, JSON_PRETTY_PRINT); ?></pre>
            </div>
            <?php endif; ?>
        </div>
        
        <h2>Troubleshooting Form Issues</h2>
        <div class="note">
            <h3>Common Issues &amp; Solutions:</h3>
            <ol>
                <li>
                    <strong>405 Method Not Allowed:</strong>
                    <ul>
                        <li>Your server might be blocking POST requests to PHP files</li>
                        <li>Check for .htaccess rules or server configurations that restrict HTTP methods</li>
                        <li>Make sure the form's action URL is accessible and allows POST requests</li>
                    </ul>
                </li>
                <li>
                    <strong>JSON Parsing Errors:</strong>
                    <ul>
                        <li>Check for PHP syntax errors in your form handler</li>
                        <li>Make sure your PHP script outputs valid JSON</li>
                        <li>Check for extra whitespace or HTML before/after the PHP tags</li>
                    </ul>
                </li>
                <li>
                    <strong>Cross-Origin Issues:</strong>
                    <ul>
                        <li>Add proper CORS headers to your PHP script</li>
                        <li>Test using a local server with matching domain</li>
                    </ul>
                </li>
            </ol>
        </div>
        
        <hr>
        <p>Generated on: <?php echo date('Y-m-d H:i:s'); ?></p>
    </div>
</body>
</html>
