const sharp = require('sharp');
const fs = require('fs');

// Create a simple owl icon as SVG
const svg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="#1B3A6B" rx="200"/>
  
  <!-- Owl body -->
  <ellipse cx="512" cy="580" rx="220" ry="260" fill="#E8A020"/>
  
  <!-- Owl head -->
  <circle cx="512" cy="350" r="200" fill="#E8A020"/>
  
  <!-- Ear tufts -->
  <polygon points="380,180 340,80 420,160" fill="#C47800"/>
  <polygon points="644,180 684,80 604,160" fill="#C47800"/>
  
  <!-- Eyes background -->
  <circle cx="440" cy="340" r="75" fill="white"/>
  <circle cx="584" cy="340" r="75" fill="white"/>
  
  <!-- Eyes -->
  <circle cx="440" cy="340" r="55" fill="#1B3A6B"/>
  <circle cx="584" cy="340" r="55" fill="#1B3A6B"/>
  
  <!-- Eye shine -->
  <circle cx="460" cy="320" r="18" fill="white"/>
  <circle cx="604" cy="320" r="18" fill="white"/>
  
  <!-- Beak -->
  <polygon points="512,390 475,440 549,440" fill="#C47800"/>
  
  <!-- Wings -->
  <ellipse cx="310" cy="600" rx="120" ry="180" fill="#C47800" transform="rotate(-15 310 600)"/>
  <ellipse cx="714" cy="600" rx="120" ry="180" fill="#C47800" transform="rotate(15 714 600)"/>
  
  <!-- Belly pattern -->
  <ellipse cx="512" cy="620" rx="130" ry="160" fill="#FDF3E0"/>
  
  <!-- Feet -->
  <ellipse cx="440" cy="830" rx="50" ry="20" fill="#C47800"/>
  <ellipse cx="584" cy="830" rx="50" ry="20" fill="#C47800"/>
  
  <!-- Text -->
  <text x="512" y="930" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">கல்வி.AI</text>
</svg>`;

async function generateIcons() {
  const svgBuffer = Buffer.from(svg);
  
  // Main icon 1024x1024
  await sharp(svgBuffer).resize(1024, 1024).png().toFile('./assets/icon.png');
  console.log('✓ icon.png');
  
  // Android foreground 1024x1024
  await sharp(svgBuffer).resize(1024, 1024).png().toFile('./assets/android-icon-foreground.png');
  console.log('✓ android-icon-foreground.png');
  
  // Android background (solid blue)
  const bgSvg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" fill="#1B3A6B"/>
  </svg>`;
  await sharp(Buffer.from(bgSvg)).resize(1024, 1024).png().toFile('./assets/android-icon-background.png');
  console.log('✓ android-icon-background.png');

  // Splash icon
  await sharp(svgBuffer).resize(512, 512).png().toFile('./assets/splash-icon.png');
  console.log('✓ splash-icon.png');
  
  // Favicon
  await sharp(svgBuffer).resize(32, 32).png().toFile('./assets/favicon.png');
  console.log('✓ favicon.png');
  
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
