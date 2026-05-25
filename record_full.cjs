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
  
  try {
    console.log('Navegando a la app...');
    await page.goto('http://localhost:5173/entry', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // --- LOGIN ---
    console.log('Haciendo clic en iniciar sesión...');
    await page.click('button:has-text("Iniciar sesión")');
    await page.waitForURL('**/login');
    
    await page.fill('input[type="email"]', `sofia_demo@puente.ai`);
    await page.fill('input[type="password"]', 'demo1234');
    
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Iniciar Sesión")');
    
    // --- HOME ---
    console.log('Esperando el Dashboard...');
    await page.waitForURL('http://localhost:5173/');
    await page.waitForTimeout(2000);
    
    // Interacción en Home: Scroll down
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    
    // --- GNN SUGGESTION (CHAT) ---
    console.log('Abriendo recomendación de Chat...');
    const chatBtn = await page.$('button:has-text("Saludar a Marta")');
    if (chatBtn) {
      await chatBtn.click();
      await page.waitForTimeout(2500);
      
      // Volver a Home
      const backBtn = await page.$('button[aria-label="Volver"]');
      if (backBtn) await backBtn.click();
      await page.waitForTimeout(1500);
    }
    
    // --- Q&A ---
    console.log('Navegando a Preguntas (Q&A)...');
    await page.goto('http://localhost:5173/qanda', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Scroll and click first question
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(1000);
    const questions = await page.$$('.questionCard, [role="button"]');
    if (questions.length > 0) {
      await questions[0].click();
      await page.waitForTimeout(3000);
    }
    
    // --- GROUPS ---
    console.log('Navegando a Grupos...');
    await page.goto('http://localhost:5173/groups', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // --- SAFETY ---
    console.log('Navegando a Emergencias (Safety)...');
    await page.goto('http://localhost:5173/safety', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
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
    const finalPath = path.join(artifactsDir, 'full_demo_recording.webm');
    try {
      fs.renameSync(videoPath, finalPath);
      console.log(`Video guardado exitosamente en: ${finalPath}`);
    } catch (e) {
      console.error('Error al renombrar el video:', e);
      console.log(`El video está en: ${videoPath}`);
    }
  }
})();
