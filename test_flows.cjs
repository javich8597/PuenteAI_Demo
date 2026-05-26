const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  async function runFlow(name, fn) {
    console.log(`\n--- Starting Flow: ${name} ---`);
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
      await fn(page);
      if (errors.length > 0) {
        console.log(`Flow ${name} finished but had errors:`);
        errors.forEach(e => console.log(e));
      } else {
        console.log(`Flow ${name} completed successfully!`);
      }
    } catch (e) {
      console.error(`Flow ${name} failed with exception:`, e.message);
      await page.screenshot({ path: `error_${name.replace(/ /g, '_')}.png` });
      if (errors.length > 0) {
        console.log(`Console/Page errors during ${name}:`);
        errors.forEach(err => console.log(err));
      }
    } finally {
      await context.close();
    }
  }

  // 1. Onboarding & Registration
  await runFlow('Onboarding and Registration', async (page) => {
    await page.goto('http://localhost:5173/');
    // Usually a new user goes to entry or onboarding
    // I don't know the exact routes, so I will try to find "Registrarse" or similar
    // Let's first log the initial URL and text to see what to click
    await page.waitForTimeout(1000);
    // Print page text to see what it is
    const text = await page.evaluate(() => document.body.innerText);
    console.log("Initial page text snippet:", text.substring(0, 200));
    
    // Attempt standard registration clicks... 
    // Wait, since I don't know the structure, let's just make the script dump the html or take a screenshot
  });

  await browser.close();
})();
