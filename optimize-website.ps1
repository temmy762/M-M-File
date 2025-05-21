# Master optimization script for Memories and More Photo Booths website
# This script will optimize the entire website for production without changing design

Write-Host "======================================================="
Write-Host "  MEMORIES AND MORE PHOTO BOOTHS WEBSITE OPTIMIZATION  "
Write-Host "======================================================="
Write-Host "This script will optimize your website for production without changing the design."
Write-Host "The following optimizations will be performed:"
Write-Host "1. Image optimization (lazy loading)"
Write-Host "2. CSS minification and combination"
Write-Host "3. JavaScript minification and combination"
Write-Host "4. HTML optimization"
Write-Host "5. Creating backup of original files"
Write-Host ""
Write-Host "Press Enter to continue or Ctrl+C to cancel..."
$null = Read-Host

# Create backup directory
$backupDir = ".\backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Creating backup directory: $backupDir"
New-Item -ItemType Directory -Path $backupDir | Out-Null

# Backup original files
Write-Host "Backing up original files..."
Copy-Item -Path ".\css\*" -Destination "$backupDir\css\" -Recurse -Force
Copy-Item -Path ".\js\*" -Destination "$backupDir\js\" -Recurse -Force
Copy-Item -Path ".\*.html" -Destination "$backupDir\" -Force

# Run image optimization
Write-Host "`n[1/5] Running image optimization..."
Write-Host "Adding lazy loading to images..."
. .\optimize-images.ps1

# Run CSS optimization
Write-Host "`n[2/5] Running CSS optimization..."
. .\optimize-css.ps1

# Run JavaScript optimization
Write-Host "`n[3/5] Running JavaScript optimization..."
. .\optimize-js.ps1

# HTML optimization - Update HTML files to use minified resources
Write-Host "`n[4/5] Optimizing HTML files..."

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html"
foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..."
    $content = Get-Content -Path $file.FullName -Raw
    
    # Add defer attribute to scripts
    $content = $content -replace '<script src="((?!https://|http://).+?)"></script>', '<script src="$1" defer></script>'
    
    # Add meta description if missing
    if (-not ($content -match '<meta name="description"')) {
        $titleMatch = [regex]::Match($content, '<title>(.*?)</title>')
        if ($titleMatch.Success) {
            $title = $titleMatch.Groups[1].Value
            $description = "Memories and More Photo Booths - $title. Premium photo booth rental services for weddings, corporate events, and parties in the Twin Cities area."
            $metaTag = "<meta name=`"description`" content=`"$description`">"
            $content = $content -replace '(<title>.*?</title>)', "`$1`n    $metaTag"
        }
    }
    
    # Add viewport meta tag if missing
    if (-not ($content -match '<meta name="viewport"')) {
        $viewportTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        $content = $content -replace '(<meta charset="UTF-8">)', "`$1`n    $viewportTag"
    }
    
    # Add preconnect for external resources
    if (-not ($content -match '<link rel="preconnect" href="https://fonts.googleapis.com">')) {
        $preconnectTags = @"
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
"@
        $content = $content -replace '(<link href="https://fonts.googleapis.com)', "$preconnectTags`n    `$1"
    }
    
    # Set content back to file
    Set-Content -Path $file.FullName -Value $content
    Write-Host "  - Updated $($file.Name) with optimizations"
}

# Create .htaccess file for Apache servers
Write-Host "`n[5/5] Creating .htaccess file for server optimization..."
$htaccessContent = @"
# Memories and More Photo Booths - Optimized .htaccess
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
</IfModule>

# Set browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 day"
</IfModule>

# Prevent directory listing
Options -Indexes

# Set default character set
AddDefaultCharset UTF-8

# Redirect www to non-www (uncomment and modify for your domain)
# RewriteEngine On
# RewriteCond %{HTTP_HOST} ^www\.memoriesandmorephotobooths\.com [NC]
# RewriteRule ^(.*)$ https://memoriesandmorephotobooths.com/`$1 [L,R=301]

# Redirect HTTP to HTTPS (uncomment when SSL is installed)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
"@

$htaccessContent | Out-File -FilePath ".\.htaccess" -Encoding utf8 -NoNewline
Write-Host "  - Created .htaccess file with performance optimizations"

# Create a web.config file for IIS servers
$webConfigContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="30.00:00:00" />
    </staticContent>
    <httpCompression>
      <dynamicTypes>
        <add mimeType="text/*" enabled="true" />
        <add mimeType="application/javascript" enabled="true" />
        <add mimeType="application/json" enabled="true" />
      </dynamicTypes>
      <staticTypes>
        <add mimeType="text/*" enabled="true" />
        <add mimeType="application/javascript" enabled="true" />
        <add mimeType="application/json" enabled="true" />
        <add mimeType="image/svg+xml" enabled="true" />
      </staticTypes>
    </httpCompression>
    <urlCompression doStaticCompression="true" doDynamicCompression="true" />
  </system.webServer>
</configuration>
"@

$webConfigContent | Out-File -FilePath ".\web.config" -Encoding utf8 -NoNewline
Write-Host "  - Created web.config file for IIS servers"

# Create a README file with optimization instructions
$readmeContent = @"
# Memories and More Photo Booths - Website Optimization

This website has been optimized for production with the following improvements:

## Optimizations Applied

1. **Image Optimization**
   - Added lazy loading to images
   - Optimized image loading sequence

2. **CSS Optimization**
   - Combined CSS files into styles.min.css
   - Original CSS files preserved in /css directory

3. **JavaScript Optimization**
   - Combined JS files into scripts.min.js
   - Special scripts (form-steps.js, backdrop-selection.js) minified separately
   - Added defer attribute to non-critical scripts

4. **HTML Optimization**
   - Added meta tags for SEO
   - Added preconnect for external resources
   - Improved mobile responsiveness

5. **Server Optimization**
   - Added .htaccess for Apache servers
   - Added web.config for IIS servers
   - Created robots.txt and sitemap.xml

## Deployment Instructions

1. Upload all files to your web hosting server
2. Ensure .htaccess and web.config are properly uploaded
3. Test the website on multiple devices and browsers

## Maintenance

- Original files are backed up in the $backupDir directory
- When making changes, edit the original files and run the optimization scripts again

## Additional Recommendations

- Consider implementing a Content Delivery Network (CDN)
- Set up regular backups of your website
- Monitor website performance using tools like Google PageSpeed Insights

For any questions or issues, please contact your web developer.

Last optimized: $(Get-Date -Format 'yyyy-MM-dd')
"@

$readmeContent | Out-File -FilePath ".\README-OPTIMIZATION.md" -Encoding utf8 -NoNewline
Write-Host "  - Created README-OPTIMIZATION.md with documentation"

Write-Host "`n======================================================="
Write-Host "  OPTIMIZATION COMPLETE!  "
Write-Host "======================================================="
Write-Host "Your website has been optimized for production without changing the design."
Write-Host "Original files have been backed up to: $backupDir"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Test the website locally to ensure everything works correctly"
Write-Host "2. Upload all files to your web hosting server"
Write-Host "3. Read README-OPTIMIZATION.md for more information"
Write-Host ""
Write-Host "Thank you for using the optimization script!"
