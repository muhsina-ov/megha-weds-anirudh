const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Paths
  // couple-2 has both Megha and Aniruddha wonderfully centered and smiling together
  const couplePath = path.join(__dirname, '../public/images/couple-2.jpg');
  const garlandPath = path.join(__dirname, '../public/images/garland.png');
  const floralCornerPath = path.join(__dirname, '../public/images/floral-corner.png');
  const mandalaPath = path.join(__dirname, '../public/images/mandala-texture.jpg');

  console.log('Composing wedding OG image with couple-2...');

  // 1. Base Emerald Canvas with Royal Lighting
  const bgSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="deepBg" cx="30%" cy="50%" r="80%">
          <stop offset="0%" stop-color="#0f3c2e" />
          <stop offset="40%" stop-color="#092820" />
          <stop offset="85%" stop-color="#031610" />
          <stop offset="100%" stop-color="#010d09" />
        </radialGradient>
        <linearGradient id="warmLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d4af37" stop-opacity="0.14" />
          <stop offset="45%" stop-color="#124e3c" stop-opacity="0" />
          <stop offset="100%" stop-color="#d4af37" stop-opacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#deepBg)" />
      <rect width="${width}" height="${height}" fill="url(#warmLight)" />
    </svg>
  `);

  let canvas = await sharp(bgSvg).png().toBuffer();

  // 2. Subtle Sacred Mandala Texture in the background
  const subtleMandala = await sharp(mandalaPath)
    .resize(width, height, { fit: 'cover' })
    .modulate({ brightness: 0.32, saturation: 0.45 })
    .toBuffer();

  const mandalaWithAlpha = await sharp(subtleMandala)
    .composite([
      {
        input: Buffer.from(`<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#000" fill-opacity="0.78"/></svg>`),
        blend: 'dest-out'
      }
    ])
    .png()
    .toBuffer();

  canvas = await sharp(canvas)
    .composite([{ input: mandalaWithAlpha, blend: 'screen' }])
    .png()
    .toBuffer();

  // 3. Arched Couple Portrait
  const coupleW = 450;
  const coupleH = 550;
  const coupleLeft = 700;
  const coupleTop = 40;

  // Mask: Dome arch
  const archMaskSvg = Buffer.from(`
    <svg width="${coupleW}" height="${coupleH}">
      <defs>
        <linearGradient id="fadeBottom" x1="0" y1="75%" x2="0" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M 0 225 A 225 225 0 0 1 ${coupleW} 225 L ${coupleW} ${coupleH} L 0 ${coupleH} Z" fill="url(#fadeBottom)" />
    </svg>
  `);

  // Crop from top so their glowing faces are placed prominently inside the arch
  const processedCouple = await sharp(couplePath)
    .resize(coupleW, Math.round(coupleW * (1024 / 682)), { fit: 'cover', position: 'top' })
    .extract({ left: 0, top: 0, width: coupleW, height: coupleH })
    .modulate({ brightness: 1.04, saturation: 1.1 })
    .sharpen({ sigma: 1.1, m1: 0.7, m2: 0.3 })
    .composite([
      {
        input: archMaskSvg,
        blend: 'dest-in'
      }
    ])
    .png()
    .toBuffer();

  // Arch Framing Vector
  const archFrameSvg = Buffer.from(`
    <svg width="${coupleW + 50}" height="${coupleH + 50}" viewBox="-25 -25 ${coupleW + 50} ${coupleH + 50}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff4d0" />
          <stop offset="25%" stop-color="#e8ca75" />
          <stop offset="50%" stop-color="#b68936" />
          <stop offset="75%" stop-color="#fdf3d0" />
          <stop offset="100%" stop-color="#9a7123" />
        </linearGradient>
        <radialGradient id="behindGlow" cx="50%" cy="40%" r="58%">
          <stop offset="0%" stop-color="#e8ca75" stop-opacity="0.45" />
          <stop offset="60%" stop-color="#e8ca75" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#e8ca75" stop-opacity="0" />
        </radialGradient>
      </defs>
      
      <!-- Halo glow behind arch -->
      <ellipse cx="${coupleW/2}" cy="${coupleH/2 - 20}" rx="${coupleW/2 + 65}" ry="${coupleH/2 + 30}" fill="url(#behindGlow)" />

      <!-- Outer Gold Arch Line -->
      <path d="M -8 225 A 233 233 0 0 1 ${coupleW + 8} 225 L ${coupleW + 8} ${coupleH + 6} L -8 ${coupleH + 6} Z" 
            fill="none" stroke="url(#archGold)" stroke-width="4.5" stroke-linejoin="round" />
      
      <!-- Beaded line -->
      <path d="M -16 225 A 241 241 0 0 1 ${coupleW + 16} 225 L ${coupleW + 16} ${coupleH + 12} L -16 ${coupleH + 12} Z" 
            fill="none" stroke="url(#archGold)" stroke-width="1.2" stroke-dasharray="4 6" opacity="0.8" />
      
      <!-- Inner Thin Gold Trim -->
      <path d="M 4 225 A 221 221 0 0 1 ${coupleW - 4} 225 L ${coupleW - 4} ${coupleH} L 4 ${coupleH} Z" 
            fill="none" stroke="#fff8e0" stroke-width="1.6" opacity="0.75" />
    </svg>
  `);

  const archFrameBuffer = await sharp(archFrameSvg).png().toBuffer();

  // 4. Foreground Typography & Vector Graphics
  const overlaySvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gold Gradients -->
        <linearGradient id="goldH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#e9cc7b" stop-opacity="0" />
          <stop offset="25%" stop-color="#e9cc7b" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#fff8e2" stop-opacity="1" />
          <stop offset="75%" stop-color="#e9cc7b" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#e9cc7b" stop-opacity="0" />
        </linearGradient>

        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d4af37" />
          <stop offset="30%" stop-color="#fdf1c8" />
          <stop offset="70%" stop-color="#a67c2e" />
          <stop offset="100%" stop-color="#f4db95" />
        </linearGradient>

        <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="35%" stop-color="#fff5dc" />
          <stop offset="70%" stop-color="#f2d78e" />
          <stop offset="100%" stop-color="#dcb25b" />
        </linearGradient>
      </defs>

      <!-- Outer Luxury Borders -->
      <rect x="18" y="18" width="${width - 36}" height="${height - 36}" 
            fill="none" stroke="url(#goldBorder)" stroke-width="2" opacity="0.85" />
      
      <rect x="25" y="25" width="${width - 50}" height="${height - 50}" 
            fill="none" stroke="url(#goldBorder)" stroke-width="0.8" opacity="0.5" stroke-dasharray="6 4" />

      <!-- Ornate Corner Motifs -->
      <g stroke="url(#goldBorder)" stroke-width="1.4" fill="none" opacity="0.85">
        <!-- Top Left -->
        <path d="M 34 50 L 34 34 L 50 34" />
        <circle cx="34" cy="34" r="2.5" fill="#fdf1c8" />
        <!-- Top Right -->
        <path d="M ${width - 50} 34 L ${width - 34} 34 L ${width - 34} 50" />
        <circle cx="${width - 34}" cy="34" r="2.5" fill="#fdf1c8" />
        <!-- Bottom Left -->
        <path d="M 34 ${height - 50} L 34 ${height - 34} L 50 ${height - 34}" />
        <circle cx="34" cy="${height - 34}" r="2.5" fill="#fdf1c8" />
        <!-- Bottom Right -->
        <path d="M ${width - 50} ${height - 34} L ${width - 34} ${height - 34} L ${width - 34} ${height - 50}" />
        <circle cx="${width - 34}" cy="${height - 34}" r="2.5" fill="#fdf1c8" />
      </g>

      <!-- ================= LEFT COLUMN: CEREMONIAL INVITATION ================= -->

      <!-- Top Invitation Header -->
      <g transform="translate(360, 78)" text-anchor="middle">
        <text font-family="'Georgia', 'Times New Roman', serif" font-size="11.5" letter-spacing="6" fill="#e8ca75" font-weight="600">
          TOGETHER WITH THEIR FAMILIES
        </text>
        <line x1="-125" y1="16" x2="125" y2="16" stroke="url(#goldH)" stroke-width="1.2" />
        <circle cx="0" cy="16" r="3" fill="#fff5d0" />
        <circle cx="-35" cy="16" r="1.5" fill="#e8ca75" />
        <circle cx="35" cy="16" r="1.5" fill="#e8ca75" />
      </g>

      <!-- Couple Names: Megha & Aniruddha -->
      <g transform="translate(360, 170)" text-anchor="middle">
        <!-- Bride Name -->
        <text font-family="'Georgia', 'Playfair Display', 'Cormorant Garamond', serif" 
              font-size="64" font-weight="600" letter-spacing="2" fill="url(#goldTextGrad)">
          Megha
        </text>
        
        <!-- Ampersand -->
        <text y="42" font-family="'Georgia', 'Times New Roman', serif" 
              font-size="44" fill="#e8ca75" font-style="italic">
          &amp;
        </text>

        <!-- Groom Name -->
        <text y="108" font-family="'Georgia', 'Playfair Display', 'Cormorant Garamond', serif" 
              font-size="64" font-weight="600" letter-spacing="2" fill="url(#goldTextGrad)">
          Aniruddha
        </text>
      </g>

      <!-- Cultural Blend Divider -->
      <g transform="translate(360, 320)" text-anchor="middle">
        <text font-family="'Georgia', serif" font-size="11" letter-spacing="4.5" fill="#d8ba66" opacity="0.9">
          CALICUT · KOLKATA
        </text>
        <line x1="-150" y1="14" x2="150" y2="14" stroke="url(#goldH)" stroke-width="1" />
        <polygon points="0,9 5,14 0,19 -5,14" fill="#fdf1c8" />
      </g>

      <!-- Invitation Tagline -->
      <g transform="translate(360, 372)" text-anchor="middle">
        <text font-family="'Georgia', serif" font-size="13" letter-spacing="5" fill="#fef6dc" font-weight="500">
          WEDDING INVITATION
        </text>
        <text y="24" font-family="'Georgia', serif" font-size="12" letter-spacing="2" fill="#cbe3d9" opacity="0.85" font-style="italic">
          Request the pleasure of your company and blessings
        </text>
      </g>

      <!-- Date, Muhurtham, and Venue Card Box -->
      <g transform="translate(360, 434)" text-anchor="middle">
        <!-- Card Backdrop -->
        <rect x="-205" y="0" width="410" height="110" rx="10" 
              fill="#06221a" fill-opacity="0.85" stroke="url(#goldBorder)" stroke-width="1.4" />
        
        <!-- Inner hairline accent -->
        <rect x="-199" y="6" width="398" height="98" rx="6" 
              fill="none" stroke="url(#goldBorder)" stroke-width="0.6" opacity="0.4" stroke-dasharray="4 4" />

        <!-- Date -->
        <text y="34" font-family="'Georgia', serif" font-size="20" letter-spacing="4" fill="#ffffff" font-weight="700">
          SUNDAY · 06 DEC 2026
        </text>

        <!-- Muhurtham -->
        <text y="60" font-family="'Georgia', serif" font-size="13" letter-spacing="2" fill="#e8ca75" font-weight="600">
          Muhurtham · 11:30 AM – 12:00 PM
        </text>

        <line x1="-135" y1="72" x2="135" y2="72" stroke="url(#goldH)" stroke-width="0.8" opacity="0.6" />

        <!-- Venue -->
        <text y="92" font-family="'Georgia', serif" font-size="12.5" letter-spacing="1.5" fill="#eef7f2">
          Kadody Convention Centre · Calicut, Kerala
        </text>
      </g>

      <!-- Website / Production Link URL badge at bottom -->
      <g transform="translate(360, 582)" text-anchor="middle">
        <rect x="-140" y="-14" width="280" height="24" rx="12" fill="#041812" fill-opacity="0.85" stroke="#d4af37" stroke-width="0.8" />
        <text y="2" font-family="'Courier New', monospace" font-size="10.5" letter-spacing="2.5" fill="#fdf1c8" font-weight="600">
          megha-weds-anirudh.pages.dev
        </text>
      </g>
    </svg>
  `);

  const overlayBuffer = await sharp(overlaySvg).png().toBuffer();

  // 5. Corner Ornaments (Floral)
  const cornerSize = 105;
  const cornerBuffer = await sharp(floralCornerPath)
    .resize(cornerSize, cornerSize)
    .png()
    .toBuffer();

  // 6. Garland - positioned elegantly right above the couple arch
  const garlandWidth = 440;
  const garlandBuffer = await sharp(garlandPath)
    .resize(garlandWidth, null, { fit: 'inside' })
    .png()
    .toBuffer();

  console.log('Compositing final high-resolution OG image...');

  await sharp(canvas)
    .composite([
      // Arch glow and frame
      {
        input: archFrameBuffer,
        top: coupleTop - 25,
        left: coupleLeft - 25,
      },
      // Vibrant couple photo
      {
        input: processedCouple,
        top: coupleTop,
        left: coupleLeft,
      },
      // Garland draped gracefully at top of couple arch (raised slightly so it frames their heads)
      {
        input: garlandBuffer,
        top: coupleTop - 58,
        left: coupleLeft + 5,
      },
      // Typography & framing overlay
      {
        input: overlayBuffer,
        top: 0,
        left: 0,
      },
      // 4 Floral corners
      {
        input: cornerBuffer,
        top: 14,
        left: 14,
      },
      {
        input: await sharp(cornerBuffer).flop().toBuffer(),
        top: 14,
        left: width - cornerSize - 14,
      },
      {
        input: await sharp(cornerBuffer).flip().toBuffer(),
        top: height - cornerSize - 14,
        left: 14,
      },
      {
        input: await sharp(cornerBuffer).flip().flop().toBuffer(),
        top: height - cornerSize - 14,
        left: width - cornerSize - 14,
      },
    ])
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(path.join(__dirname, '../public/og-image.jpg'));

  // Also write PNG
  await sharp(path.join(__dirname, '../public/og-image.jpg'))
    .png({ quality: 95, compressionLevel: 7 })
    .toFile(path.join(__dirname, '../public/og-image.png'));

  console.log('OG image generation complete: public/og-image.jpg & public/og-image.png');
}

createOgImage().catch(err => {
  console.error(err);
  process.exit(1);
});
