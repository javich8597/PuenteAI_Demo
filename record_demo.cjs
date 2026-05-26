const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Guardaremos el video directamente en la carpeta de artefactos
  const videoDir = 'C:\\Users\\javi_\\.gemini\\antigravity\\brain\\2f7900a6-40f1-43cc-9324-c9356ca08c0d';
  
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 390, height: 844 } // Mobile size
    },
    viewport: { width: 390, height: 844 }
  });

  const page = await context.newPage();

  console.log("Navigating to app...");
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  console.log("Clicking Explorar sin registro...");
  await page.click('button:has-text("Explorar sin registro")');
  await page.waitForTimeout(2000);

  console.log("Clicking Explorar nav tab...");
  await page.click('text="Explorar"');
  await page.waitForTimeout(2000);

  console.log("Clicking Legal Category...");
  await page.click('button:has-text("Legal")');
  await page.waitForTimeout(2000);

  console.log("Clicking Drill-Down button...");
  await page.click('button:has-text("Solicitar ayuda personalizada")');
  await page.waitForTimeout(2000);

  console.log("Going through Quiz...");
  for (let i = 0; i < 15; i++) {
    await page.waitForSelector('button:has-text("Saltar")');
    if (i === 12) {
      await page.click('button:has-text("Un poco ansiosa")');
      await page.waitForTimeout(1000);
    } else {
      await page.click('button:has-text("Saltar")');
      await page.waitForTimeout(800);
    }
  }

  console.log("Waiting for Action Plan...");
  await page.waitForTimeout(2000);

  // Scroll lento para ver el Plan de Acción
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1500);
  
  // Abrir el acordeón "Empadronarte" si no está abierto (debería estarlo por defecto, pero por si acaso)
  // El texto dice PASO 1 Empadronarte
  
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000);
  
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000);

  console.log("Closing browser...");
  await context.close();
  await browser.close();

  // Renombramos el archivo de video generado a uno más amigable
  const fs = require('fs');
  const files = fs.readdirSync(videoDir);
  const videoFile = files.find(f => f.endsWith('.webm') && f.length > 25);
  
  if (videoFile) {
    const oldPath = path.join(videoDir, videoFile);
    const newPath = path.join(videoDir, 'drilldown_demo.webm');
    if (fs.existsSync(newPath)) fs.unlinkSync(newPath); // Borrar si ya existe
    fs.renameSync(oldPath, newPath);
    console.log("Video guardado como drilldown_demo.webm");
  }

})();
