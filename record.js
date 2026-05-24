import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('Lanzando navegador...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'C:/Users/javi_/.gemini/antigravity/brain/2f7900a6-40f1-43cc-9324-c9356ca08c0d/',
      size: { width: 414, height: 896 }
    },
    viewport: { width: 414, height: 896 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Navegando a la app...');
    await page.goto('http://localhost:5173/');
    
    // Esperar a que cargue
    await page.waitForTimeout(2000);
    
    // 1. Entry Page - Clic en Registrarse
    console.log('Haciendo clic en registrarse...');
    await page.click('text="Crear mi cuenta"');
    
    // 2. Onboarding Paso 1
    console.log('Llenando datos básicos...');
    await page.waitForTimeout(1000);
    await page.fill('input[type="text"][placeholder="Ej: Ana"]', 'Carmen');
    await page.fill('input[type="text"][placeholder="Ej: García López"]', 'Fernández');
    await page.fill('input[type="tel"]', '612345678');
    await page.fill('input[type="email"]', `carmen_${Date.now()}@test.com`);
    await page.fill('input[type="password"]', 'secreta123');
    
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Continuar")');
    
    // 3. Onboarding Paso 2 (Barrio)
    console.log('Seleccionando barrio...');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Gràcia")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Continuar")');
    
    // 4. Onboarding Paso 3 (Idioma y situación)
    console.log('Seleccionando idioma y situación...');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Español")');
    await page.waitForTimeout(500);
    await page.click('div[role="radio"]:has-text("Recién llegada")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Continuar")');
    
    // 5. Onboarding Paso 4 (Intereses)
    console.log('Seleccionando intereses...');
    await page.waitForTimeout(1000);
    await page.click('div[role="checkbox"]:has-text("Empleo")');
    await page.click('div[role="checkbox"]:has-text("Salud")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Continuar")');
    
    // 6. Onboarding Paso 5 (Tutorial)
    console.log('Viendo el tutorial...');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("Empezar mi camino")');
    
    // 7. Esperar a Home / Dashboard y las recomendaciones
    console.log('Esperando el Dashboard...');
    await page.waitForSelector('text="¡Hola, Carmen!"');
    await page.waitForSelector('text="Conecta con Marta"');
    
    console.log('Revisando recomendaciones...');
    await page.waitForTimeout(5000);
    
    // Click en la recomendación de mentora (Chat)
    console.log('Abriendo chat con mentora...');
    await page.click('button:has-text("Saludar a Marta")');
    
    await page.waitForTimeout(3000);
    
    console.log('Prueba finalizada con éxito.');
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    // Cerrar navegador (esto guarda el video)
    await context.close();
    await browser.close();
  }
})();
