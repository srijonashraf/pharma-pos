const sharp = require('sharp');
const fs = require('fs');

async function generateFavicons() {
  const input = 'public/pos-terminal.png';
  const output = 'public/favicon.ico';

  try {
    // Create a square favicon by center-cropping the image to 32x32
    await sharp(input)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .toFile(output);

    console.log('✓ Generated favicon.ico');

    // Also create a 16x16 version for older browsers
    await sharp(input)
      .resize(16, 16, { fit: 'cover', position: 'center' })
      .toFile('public/favicon-16x16.png');
    console.log('✓ Generated favicon-16x16.png');

    // Create 32x32 PNG
    await sharp(input)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .toFile('public/favicon-32x32.png');
    console.log('✓ Generated favicon-32x32.png');

    // Create apple-touch-icon
    await sharp(input)
      .resize(180, 180, { fit: 'cover', position: 'center' })
      .toFile('public/apple-touch-icon.png');
    console.log('✓ Generated apple-touch-icon.png');
  } catch (err) {
    console.error('Error generating favicons:', err);
  }
}

generateFavicons();
