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
      size: { width: 1280, height: 720 } // Desktop view para el panel admin
    },
    viewport: { width: 1280, height: 720 }
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
      await page.waitForTimeout(1000);
      await el.click({ timeout: 5000 });
    } catch (e) {
      console.warn(`No se pudo hacer clic en ${selector}:`, e.message);
    }
  }

  try {
    console.log('Navegando a la app...');
    // Asegurarse de que el servidor local está corriendo en 5173
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // --- LOGIN ADMIN ---
    console.log('Escribiendo credenciales admin...');
    const emailInput = page.locator('input[type="email"]');
    await emailInput.hover();
    await page.waitForTimeout(500);
    await emailInput.click();
    await emailInput.type('admin@demo.com', { delay: 100 });
    
    await page.waitForTimeout(1000);
    
    const passInput = page.locator('input[type="password"]');
    await passInput.hover();
    await page.waitForTimeout(500);
    await passInput.click();
    await passInput.type('admin123', { delay: 100 });
    
    await page.waitForTimeout(1500);
    await hoverAndClick('button:has-text("Iniciar Sesión")');
    
    // --- ADMIN PANEL ---
    console.log('Esperando el Admin Dashboard...');
    await page.waitForURL('http://localhost:5174/admin');
    await page.waitForTimeout(4000);
    
    // Interacción en Admin: Scroll
    console.log('Explorando panel de administración...');
    await page.mouse.move(600, 400); 
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(3000);
    
    // Simular lectura de reportes o estadísticas
    await page.mouse.move(300, 300);
    await page.waitForTimeout(2000);
    await page.mouse.move(800, 400);
    await page.waitForTimeout(2000);

    // --- SWITCH TO USER VIEW ---
    console.log('Cambiando a Vista de Usuaria...');
    await hoverAndClick('button:has-text("Vista de Usuaria")');
    await page.waitForTimeout(4000);
    
    console.log('Explorando vista de usuaria...');
    await page.waitForURL('http://localhost:5174/');
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, -400);
    await page.waitForTimeout(3000);
    
    console.log('Demo admin completada.');
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    const videoPath = await page.video().path();
    await context.close();
    await browser.close();
    
    const finalPath = path.join(artifactsDir, 'admin_demo_1m30s.webm');
    try {
      fs.renameSync(videoPath, finalPath);
      console.log(`Video guardado exitosamente en: ${finalPath}`);
    } catch (e) {
      console.error('Error al renombrar el video:', e);
      console.log(`El video está en: ${videoPath}`);
    }
  }
})();
