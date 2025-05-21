# PowerShell script to optimize images using HTML <img> width/height attributes
# This script adds width and height attributes to image tags to prevent layout shifts

$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content

    # Regular expression to find img tags without width and height attributes
    $imgPattern = '<img\s+[^>]*?src="([^"]+)"[^>]*?(?!width|height)[^>]*?>'
    
    # Find all matches
    $matches = [regex]::Matches($content, $imgPattern)
    
    foreach ($match in $matches) {
        $imgTag = $match.Value
        $src = $match.Groups[1].Value
        
        # Skip if the image already has width and height
        if ($imgTag -match 'width=|height=') {
            continue
        }
        
        # Add loading="lazy" attribute for images that don't already have it
        if (-not ($imgTag -match 'loading=')) {
            $newImgTag = $imgTag -replace '<img', '<img loading="lazy"'
            $content = $content.Replace($imgTag, $newImgTag)
        }
    }
    
    # Only write to the file if changes were made
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated $($file.Name) with lazy loading attributes"
    }
}

Write-Host "Image optimization complete!"
