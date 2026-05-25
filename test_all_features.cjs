const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', (err) => {
    errors.push(`PageError: ${err.message}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`ConsoleError: ${msg.text()}`);
    }
  });

  try {
    console.log('Navigating to app...');
    await page.goto('http://localhost:5173/entry', { waitUntil: 'networkidle' });

    console.log('Logging in...');
    await page.click('button:has-text("Iniciar sesión")');
    await page.waitForURL('**/login');
    await page.fill('input[type="email"]', 'test@demo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar al home
    await page.waitForURL('http://localhost:5173/');
    console.log('Landed on Home.');

    const routesToTest = [
      '/categories',
      '/recommendations',
      '/qanda',
      '/groups',
      '/chat',
      '/safety',
      '/rewards',
      '/privacy',
      '/explore'
    ];

    for (const route of routesToTest) {
      console.log(`Testing route ${route}...`);
      await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' });
      // Simple wait to ensure rendering doesn't crash
      await page.waitForTimeout(500);
    }

    console.log('Testing interactions in Q&A...');
    await page.goto('http://localhost:5173/qanda', { waitUntil: 'networkidle' });
    // Click on the first question if available
    const questionLinks = await page.$$('.questionCard, [role="button"]');
    if (questionLinks.length > 0) {
      await questionLinks[0].click();
      await page.waitForTimeout(500);
    }

    console.log('Testing interactions in Groups...');
    await page.goto('http://localhost:5173/groups', { waitUntil: 'networkidle' });
    const groupLinks = await page.$$('.groupCard, [role="button"]');
    if (groupLinks.length > 0) {
      await groupLinks[0].click();
      await page.waitForTimeout(500);
    }

    console.log('Testing interactions in Chat...');
    await page.goto('http://localhost:5173/chat', { waitUntil: 'networkidle' });
    const chatLinks = await page.$$('.chatItem, [role="button"]');
    if (chatLinks.length > 0) {
      await chatLinks[0].click();
      await page.waitForTimeout(500);
    }

  } catch (e) {
    console.error('Test script failed:', e);
  } finally {
    if (errors.length > 0) {
      console.log('--- FOUND ERRORS ---');
      errors.forEach(e => console.log(e));
    } else {
      console.log('--- NO ERRORS FOUND ---');
    }
    await browser.close();
  }
})();
