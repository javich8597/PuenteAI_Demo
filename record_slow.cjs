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
      size: { width: 414, height: 896 }
    },
    viewport: { width: 414, height: 896 }
  });
  
  const page = await context.newPage();

  // Inyectar un cursor visible
  await page.addInitScript(() => {
    const cursor = document.createElement('div');
    cursor.id = 'playwright-cursor';
    cursor.style.width = '30px';
    cursor.style.height = '30px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(224, 122, 95, 0.6)'; // Color coral de la marca
    cursor.style.border = '2px solid white';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '999999';
    cursor.style.top = '50%';
    cursor.style.left = '50%';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'left 0.3s ease-out, top 0.3s ease-out, background-color 0.1s, transform 0.1s';
    
    // Asegurarse de agregarlo cuando cargue el body
    const appendCursor = () => {
      if (!document.getElementById('playwright-cursor')) {
        document.body.appendChild(cursor);
      }
    };
    
    window.addEventListener('DOMContentLoaded', appendCursor);
    // MutationObserver por si la app borra el body (e.g. React)
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

  // Helper para mover el ratón de forma visible y luego clicar
  async function hoverAndClick(selector) {
    try {
      const el = await page.locator(selector).first();
      await el.hover({ timeout: 5000 });
      await page.waitForTimeout(1000); // Pausa para que se vea donde está el ratón
      await el.click({ timeout: 5000 });
    } catch (e) {
      console.warn(`No se pudo hacer clic en ${selector}:`, e.message);
    }
  }

  try {
    console.log('Navegando a la app...');
    await page.goto('http://localhost:5173/entry', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // --- LOGIN ---
    console.log('Haciendo clic en iniciar sesión...');
    await hoverAndClick('button:has-text("Iniciar sesión")');
    await page.waitForURL('**/login');
    await page.waitForTimeout(2000);
    
    console.log('Escribiendo credenciales...');
    const emailInput = page.locator('input[type="email"]');
    await emailInput.hover();
    await page.waitForTimeout(500);
    await emailInput.click();
    await emailInput.type('sofia_demo@puente.ai', { delay: 150 });
    
    await page.waitForTimeout(1500);
    
    const passInput = page.locator('input[type="password"]');
    await passInput.hover();
    await page.waitForTimeout(500);
    await passInput.click();
    await passInput.type('demo1234', { delay: 150 });
    
    await page.waitForTimeout(2000);
    await hoverAndClick('button:has-text("Iniciar Sesión")');
    
    // --- HOME ---
    console.log('Esperando el Dashboard...');
    await page.waitForURL('http://localhost:5173/');
    await page.waitForTimeout(4000);
    
    // Interacción en Home: Scroll down
    console.log('Haciendo scroll en Home...');
    await page.mouse.move(200, 400); // Mover cursor al centro
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, -400);
    await page.waitForTimeout(3000);
    
    // --- GNN SUGGESTION (CHAT) ---
    console.log('Abriendo recomendación de Chat...');
    const chatBtn = page.locator('button:has-text("Saludar a Marta")');
    if (await chatBtn.count() > 0) {
      await hoverAndClick('button:has-text("Saludar a Marta")');
      await page.waitForTimeout(4000);
      
      // Volver a Home
      await hoverAndClick('button[aria-label="Volver atrás"], button[aria-label="Volver"]');
      await page.waitForTimeout(3000);
    }
    
    // --- Q&A ---
    console.log('Navegando a Preguntas (Q&A)...');
    
    // Clicking 'Preguntas' from the quick actions on Home
    const pregBtn = page.locator('text="Preguntas"').first();
    if (await pregBtn.count() > 0) {
      await pregBtn.hover();
      await page.waitForTimeout(1000);
      await pregBtn.click();
    } else {
      await page.goto('http://localhost:5173/qanda', { waitUntil: 'networkidle' });
    }
    
    await page.waitForTimeout(3000);
    
    // Scroll and click first question
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(2000);
    
    const questions = await page.$$('.questionCard, [role="button"]');
    if (questions.length > 0) {
      await page.locator('.questionCard, [role="button"]').first().hover();
      await page.waitForTimeout(1000);
      await page.locator('.questionCard, [role="button"]').first().click();
      await page.waitForTimeout(4000);
      
      // Volver
      const backQBtn = page.locator('button[aria-label="Volver atrás"], button[aria-label="Volver"]').first();
      if (await backQBtn.count() > 0) {
         await backQBtn.hover();
         await page.waitForTimeout(1000);
         await backQBtn.click();
      } else {
         await page.goto('http://localhost:5173/qanda');
      }
      await page.waitForTimeout(2000);
    }
    
    // --- GROUPS ---
    console.log('Navegando a Grupos...');
    await page.goto('http://localhost:5173/groups', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    
    const groupLinks = page.locator('.groupCard, [role="button"]').first();
    if (await groupLinks.count() > 0) {
        await groupLinks.hover();
        await page.waitForTimeout(1000);
        await groupLinks.click();
        await page.waitForTimeout(4000);
        
        const backGBtn = page.locator('button[aria-label="Volver atrás"], button[aria-label="Volver"]').first();
        if (await backGBtn.count() > 0) {
           await backGBtn.hover();
           await page.waitForTimeout(1000);
           await backGBtn.click();
        } else {
           await page.goto('http://localhost:5173/groups');
        }
    }
    
    await page.waitForTimeout(2000);

    // --- CATEGORIES ---
    console.log('Navegando a Categorías...');
    await page.goto('http://localhost:5173/categories', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(3000);
    
    // --- SAFETY ---
    console.log('Navegando a Emergencias (Safety)...');
    await page.goto('http://localhost:5173/safety', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    console.log('Demo completada.');
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    // Guardar ruta del video
    const videoPath = await page.video().path();
    
    // Cerrar navegador
    await context.close();
    await browser.close();
    
    // Renombrar el video a algo reconocible
    const finalPath = path.join(artifactsDir, 'demo_lenta_1m30s.webm');
    try {
      fs.renameSync(videoPath, finalPath);
      console.log(`Video guardado exitosamente en: ${finalPath}`);
    } catch (e) {
      console.error('Error al renombrar el video:', e);
      console.log(`El video está en: ${videoPath}`);
    }
  }
})();
