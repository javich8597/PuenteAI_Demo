const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Lanzando navegador...');
  const browser = await chromium.launch({ headless: true });
  
  const artifactsDir = 'C:/Users/javi_/.gemini/antigravity/brain/2f7900a6-40f1-43cc-9324-c9356ca08c0d/';
  
  const context = await browser.newContext({
    recordVideo: {
      dir: artifactsDir,
      size: { width: 375, height: 812 } // Mobile view
    },
    viewport: { width: 375, height: 812 }
  });
  
  const page = await context.newPage();

  // Inyectar un cursor visible
  await page.addInitScript(() => {
    const cursor = document.createElement('div');
    cursor.id = 'playwright-cursor';
    cursor.style.width = '30px';
    cursor.style.height = '30px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(224, 122, 95, 0.6)';
    cursor.style.border = '2px solid white';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '999999';
    cursor.style.top = '50%';
    cursor.style.left = '50%';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'left 0.3s ease-out, top 0.3s ease-out, background-color 0.1s, transform 0.1s';
    
    const appendCursor = () => {
      if (!document.getElementById('playwright-cursor')) {
        document.body.appendChild(cursor);
      }
    };
    
    window.addEventListener('DOMContentLoaded', appendCursor);
    new MutationObserver(appendCursor).observe(document.documentElement, { childList: true, subtree: true });
    
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    
    window.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      cursor.style.backgroundColor = 'rgba(224, 122, 95, 0.9)';
    });
    
    window.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'rgba(224, 122, 95, 0.6)';
    });
  });

  async function hoverAndClick(selector) {
    try {
      const el = await page.locator(selector).first();
      await el.hover({ timeout: 5000 });
      await page.waitForTimeout(600);
      await el.click({ timeout: 5000 });
    } catch (e) {
      console.warn(`No se pudo hacer clic en ${selector}:`, e.message);
    }
  }

  try {
    console.log('Navegando a la app...');
    await page.goto('http://localhost:5174/entry', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(artifactsDir, 'debug_entry.png') });
    
    // Select English
    console.log('Seleccionando idioma EN...');
    await hoverAndClick('button:text-is("EN")');
    await page.waitForTimeout(1000);
    
    // Click Create my account
    console.log('Iniciando Onboarding...');
    await hoverAndClick('button:has-text("Crear mi cuenta")'); // Try Spanish text for fallback? No, let's keep it robust.
    await hoverAndClick('button:has-text("Create my account")');
    await page.waitForTimeout(3000);
    
    // Step 1: Welcome
    await hoverAndClick('button:has-text("Next")');
    await page.waitForTimeout(1500);

    // Question steps (2 to 7) - Just click "Prefer not to answer" which auto-advances
    for (let i = 0; i < 6; i++) {
        await hoverAndClick('button:has-text("Prefer not to answer")');
        await page.waitForTimeout(1500); // Wait for auto-advance
    }

    // Step 8: Registration Form
    console.log('Llenando formulario de registro...');
    await page.locator('input[type="text"]').first().fill('Jane Doe');
    await page.waitForTimeout(500);
    const userEmail = `jane${Date.now()}@demo.com`;
    await page.locator('input[type="email"]').first().fill(userEmail);
    await page.waitForTimeout(500);
    await page.locator('input[type="password"]').first().fill('jane1234');
    await page.waitForTimeout(1000);
    
    await hoverAndClick('button:has-text("✨ Create account and start")');
    
    // Wait for Home
    console.log('Esperando vista Home...');
    await page.waitForURL('http://localhost:5174/');
    await page.waitForTimeout(3000);
    
    // Scroll a bit
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(2000);

    // LOG OUT
    console.log('Cerrando sesión...');
    await hoverAndClick('button:has-text("J")'); // Avatar might be J
    await page.waitForTimeout(1000);
    // the logout button in AppShell is a LogOut icon or text? In EN it's probably "Log out"
    // Let's just go to /entry directly to simulate logout for safety in script if we can't find button
    await page.goto('http://localhost:5174/entry', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // LOG IN
    console.log('Iniciando sesión...');
    await hoverAndClick('button:has-text("Log in")');
    await page.waitForTimeout(2000);
    
    await page.locator('input[type="email"]').first().fill(userEmail);
    await page.waitForTimeout(500);
    await page.locator('input[type="password"]').first().fill('jane1234');
    await page.waitForTimeout(1000);
    
    await page.locator('button[type="submit"]').click();

    console.log('Esperando acceso exitoso...');
    await page.waitForURL('http://localhost:5174/');
    await page.waitForTimeout(3000);

    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(2000);
    await hoverAndClick('a[href="/explore"]');
    await page.waitForTimeout(3000);
    
    console.log('Prueba completada.');
  } catch (err) {
    console.error('Error durante la prueba:', err);
    await page.screenshot({ path: path.join(artifactsDir, 'error_screenshot.png') });
  } finally {
    const videoPath = await page.video().path();
    await context.close();
    await browser.close();
    
    const finalPath = path.join(artifactsDir, 'test_onboarding_en.webm');
    try {
      fs.renameSync(videoPath, finalPath);
      console.log(`Video guardado exitosamente en: ${finalPath}`);
    } catch (e) {
      console.error('Error al renombrar el video:', e);
      console.log(`El video está en: ${videoPath}`);
    }
  }
})();
