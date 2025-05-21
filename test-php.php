<?php
echo "PHP Setup Test<br><br>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Extension Check:<br>";
echo "- mysqli: " . (extension_loaded('mysqli') ? "Loaded" : "Not loaded") . "<br>";
echo "- mbstring: " . (extension_loaded('mbstring') ? "Loaded" : "Not loaded") . "<br>";
echo "- openssl: " . (extension_loaded('openssl') ? "Loaded" : "Not loaded") . "<br>";
echo "- fileinfo: " . (extension_loaded('fileinfo') ? "Loaded" : "Not loaded") . "<br>";
echo "<br>Mail Configuration:<br>";
echo "- SMTP: " . ini_get('SMTP') . "<br>";
echo "- smtp_port: " . ini_get('smtp_port') . "<br>";
echo "- sendmail_from: " . ini_get('sendmail_from') . "<br>";
echo "<br>Environment:<br>";
echo "- max_execution_time: " . ini_get('max_execution_time') . " seconds<br>";
echo "- memory_limit: " . ini_get('memory_limit') . "<br>";
echo "- post_max_size: " . ini_get('post_max_size') . "<br>";
echo "- upload_max_filesize: " . ini_get('upload_max_filesize') . "<br>";
echo "<br>Timezone Settings:<br>";
echo "- date.timezone: " . ini_get('date.timezone') . "<br>";
echo "- Current time: " . date('Y-m-d H:i:s') . "<br>";
?>
