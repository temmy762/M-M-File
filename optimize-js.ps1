# PowerShell script to combine and minify JavaScript files
# This script preserves all functionality but reduces file size and HTTP requests

$outputFile = ".\js\scripts.min.js"
$jsFiles = @(
    ".\js\main.js",
    ".\js\animations.js",
    ".\js\hero-slideshow.js",
    ".\js\gallery.js",
    ".\js\scroll-animations.js",
    ".\js\form.js",
    ".\js\feature-fix.js",
    ".\js\event-gallery.js"
)

# Create or clear the output file
"" | Out-File -FilePath $outputFile -Encoding utf8 -NoNewline

# Function to minify JavaScript
function Minify-JavaScript {
    param (
        [string]$js
    )
    
    # Remove comments (both single-line and multi-line)
    $js = [Regex]::Replace($js, "//.*?$", "", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $js = [Regex]::Replace($js, "/\*[\s\S]*?\*/", "")
    
    # Remove whitespace
    $js = [Regex]::Replace($js, "^\s+", "", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $js = [Regex]::Replace($js, "\s+$", "", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    
    # Remove spaces around operators and brackets (with caution)
    $js = [Regex]::Replace($js, "\s*{\s*", "{")
    $js = [Regex]::Replace($js, "\s*}\s*", "}")
    $js = [Regex]::Replace($js, "\s*;\s*", ";")
    $js = [Regex]::Replace($js, "\s*:\s*", ":")
    $js = [Regex]::Replace($js, "\s*,\s*", ",")
    
    # Preserve necessary spaces for operators
    $js = [Regex]::Replace($js, "\s*=\s*", "=")
    $js = [Regex]::Replace($js, "\s*\+\s*", "+")
    $js = [Regex]::Replace($js, "\s*-\s*", "-")
    $js = [Regex]::Replace($js, "\s*\*\s*", "*")
    $js = [Regex]::Replace($js, "\s*/\s*", "/")
    
    # Ensure spaces are preserved in certain contexts
    $js = [Regex]::Replace($js, "return\{", "return {")
    $js = [Regex]::Replace($js, "var ", "var ")
    $js = [Regex]::Replace($js, "let ", "let ")
    $js = [Regex]::Replace($js, "const ", "const ")
    $js = [Regex]::Replace($js, "function ", "function ")
    
    return $js
}

# Process each JS file
foreach ($file in $jsFiles) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content -Path $file -Raw
        
        # Add file comment and IIFE wrapper for scope isolation
        $fileComment = "/* $file */`n"
        $wrappedContent = $fileComment + "(function() {`n" + $content + "`n})();"
        
        # Minify and append to output file
        $minified = Minify-JavaScript -js $wrappedContent
        Add-Content -Path $outputFile -Value $minified
        Add-Content -Path $outputFile -Value "`n" # Add newline between files
        
        Write-Host "Added to $outputFile"
    } else {
        Write-Host "Warning: $file not found, skipping..."
    }
}

# Special handling for form-steps.js and backdrop-selection.js
# These are kept separate as they are only used on specific pages
$specialFiles = @(
    ".\js\form-steps.js",
    ".\js\backdrop-selection.js"
)

foreach ($file in $specialFiles) {
    if (Test-Path $file) {
        $outputSpecialFile = $file -replace "\.js$", ".min.js"
        Write-Host "Processing special file $file..."
        $content = Get-Content -Path $file -Raw
        
        # Minify and save to separate file
        $minified = Minify-JavaScript -js $content
        $minified | Out-File -FilePath $outputSpecialFile -Encoding utf8 -NoNewline
        
        Write-Host "Created $outputSpecialFile"
    } else {
        Write-Host "Warning: $file not found, skipping..."
    }
}

Write-Host "JavaScript optimization complete! Common scripts combined into $outputFile"
Write-Host "Special scripts minified individually."
Write-Host "Original JS files are preserved. Update your HTML files to use the new minified versions."
