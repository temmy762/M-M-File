# Add PHP to System PATH
$phpPath = "C:\Users\user\Desktop\PHP"

# Get current PATH for the user
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

# Check if path already exists in the PATH
if ($currentPath -notlike "*$phpPath*") {
    # Append PHP path to the current PATH
    $newPath = "$currentPath;$phpPath"
    
    # Update the PATH environment variable
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    
    Write-Host "PHP has been added to your PATH environment variable." -ForegroundColor Green
    Write-Host "You may need to restart your terminal or applications to use PHP from any location."
} else {
    Write-Host "PHP is already in your PATH environment variable." -ForegroundColor Yellow
}

# Display the updated PATH
Write-Host "`nUpdated PATH for the current user:" -ForegroundColor Cyan
[Environment]::GetEnvironmentVariable("PATH", "User")

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
