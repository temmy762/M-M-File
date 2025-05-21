# PowerShell script to combine and minify CSS files
# This script preserves all styles but reduces file size and HTTP requests

$outputFile = ".\css\styles.min.css"
$cssFiles = @(
    ".\css\style.css",
    ".\css\animations.css",
    ".\css\footer-styles.css",
    ".\css\logo-styles.css",
    ".\css\navbar-styles.css",
    ".\css\responsive.css",
    ".\css\header-fix.css",
    ".\css\gallery-styles.css",
    ".\css\event-gallery-styles.css",
    ".\css\services-styles.css",
    ".\css\services-cta.css",
    ".\css\booth-custom.css",
    ".\css\cta-styles.css",
    ".\css\lightbox-custom.css",
    ".\css\backdrop-styles.css"
)

# Create or clear the output file
"" | Out-File -FilePath $outputFile -Encoding utf8 -NoNewline

# Function to minify CSS
function Minify-CSS {
    param (
        [string]$css
    )
    
    # Remove comments
    $css = [Regex]::Replace($css, "/\*[\s\S]*?\*/", "")
    
    # Remove whitespace
    $css = [Regex]::Replace($css, "\s+", " ")
    
    # Remove spaces around brackets and semicolons
    $css = [Regex]::Replace($css, "\s*{\s*", "{")
    $css = [Regex]::Replace($css, "\s*}\s*", "}")
    $css = [Regex]::Replace($css, "\s*;\s*", ";")
    $css = [Regex]::Replace($css, "\s*:\s*", ":")
    $css = [Regex]::Replace($css, "\s*,\s*", ",")
    
    # Remove last semicolon in each block
    $css = [Regex]::Replace($css, ";}","}")
    
    return $css
}

# Process each CSS file
foreach ($file in $cssFiles) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content -Path $file -Raw
        
        # Add file comment for debugging purposes
        $fileComment = "/* $file */"
        Add-Content -Path $outputFile -Value $fileComment
        
        # Minify and append to output file
        $minified = Minify-CSS -css $content
        Add-Content -Path $outputFile -Value $minified
        
        Write-Host "Added to $outputFile"
    } else {
        Write-Host "Warning: $file not found, skipping..."
    }
}

Write-Host "CSS optimization complete! All styles combined into $outputFile"
Write-Host "Original CSS files are preserved. Update your HTML files to use the new minified version."
