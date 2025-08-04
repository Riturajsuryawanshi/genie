const fs = require('fs');
const path = require('path');

// Simple SVG to PNG conversion script
// Note: This creates a basic HTML page that can render SVGs for screenshot conversion

function createConversionHTML() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Logo Conversion</title>
  <style>
    body { margin: 0; padding: 20px; background: white; }
    .logo-container { margin: 20px 0; border: 1px solid #ccc; display: inline-block; }
    .logo-512 { width: 512px; height: 512px; }
    .logo-32 { width: 32px; height: 32px; }
    h3 { margin: 10px 0 5px 0; }
  </style>
</head>
<body>
  <h1>CallGenie Logo Conversion Helper</h1>
  <p>Take screenshots of these logos to create PNG files:</p>
  
  <h3>Main Logo (512x512px) - Save as 'logo.png'</h3>
  <div class="logo-container">
    ${fs.readFileSync('./public/logo-simple.svg', 'utf8')}
  </div>
  
  <h3>Favicon (32x32px) - Save as 'favicon.png'</h3>  
  <div class="logo-container">
    <div class="logo-32">
      ${fs.readFileSync('./public/favicon.svg', 'utf8')}
    </div>
  </div>
  
  <h3>Instructions:</h3>
  <ol>
    <li>Right-click on each logo above</li>
    <li>Select "Save image as..." or take a screenshot</li>
    <li>Save with the specified filename in the 'public' folder</li>
    <li>For ICO conversion, use an online tool like convertio.co</li>
  </ol>
  
  <script>
    // Auto-set the SVG sizes
    document.querySelectorAll('.logo-32 svg').forEach(svg => {
      svg.setAttribute('width', '32');
      svg.setAttribute('height', '32');
    });
  </script>
</body>
</html>`;

  fs.writeFileSync('./logo-conversion.html', html);
  console.log('✅ Created logo-conversion.html');
  console.log('📖 Instructions:');
  console.log('   1. Open logo-conversion.html in your browser');
  console.log('   2. Right-click and save each logo image');
  console.log('   3. Use online tools to convert PNG to ICO if needed');
}

// Alternative: If sharp is available, use it for conversion
function convertWithSharp() {
  try {
    const sharp = require('sharp');
    
    console.log('🔄 Converting SVG files to PNG using Sharp...');
    
    // Convert main logo
    sharp('./public/logo-simple.svg')
      .resize(512, 512)
      .png()
      .toFile('./public/logo.png')
      .then(() => console.log('✅ Created logo.png (512x512)'))
      .catch(err => console.log('❌ Error creating logo.png:', err.message));
    
    // Convert favicon
    sharp('./public/favicon.svg')
      .resize(32, 32)
      .png()
      .toFile('./public/favicon.png')
      .then(() => console.log('✅ Created favicon.png (32x32)'))
      .catch(err => console.log('❌ Error creating favicon.png:', err.message));
      
  } catch (err) {
    console.log('❌ Sharp not available. Creating HTML conversion helper instead.');
    createConversionHTML();
  }
}

// Try sharp first, fallback to HTML method
convertWithSharp();