const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('response', response => {
    if (response.status() === 400) {
      console.log(`400 ERROR ON URL: ${response.url()}`);
    }
  });

  try {
    await page.goto('http://localhost:5173/entry', { waitUntil: 'networkidle' });
    await page.click('button:has-text("Iniciar sesión")');
    await page.waitForURL('**/login');
    await page.fill('input[type="email"]', 'admin@demo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForURL('http://localhost:5173/');

    const routes = [
      '/categories', '/recommendations', '/qanda', '/groups', 
      '/chat', '/safety', '/rewards', '/privacy', '/explore'
    ];

    for (const route of routes) {
      console.log(`Testing route ${route}...`);
      await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
    }
  } catch(e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
