const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  async function checkErrors(page, name, action) {
    console.log(`\n--- Starting Flow: ${name} ---`);
    const errors = [];
    page.on('pageerror', (err) => errors.push(`PageError: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`ConsoleError: ${msg.text()}`);
    });
    
    try {
      await action(page);
    } catch (e) {
      errors.push(`ScriptError: ${e.message}`);
      await page.screenshot({ path: `error_${name.replace(/ /g, '_')}.png` });
    }
    
    if (errors.length > 0) {
      console.log(`[x] ${name} Failed with errors:`);
      errors.forEach(e => console.log(e));
    } else {
      console.log(`[v] ${name} Passed!`);
    }
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Onboarding
  await checkErrors(page, 'Onboarding', async (p) => {
    await p.goto('http://localhost:5173/entry');
    // Try to find the register button
    const registerBtn = p.locator('text=/Registrar/i').first();
    if (await registerBtn.isVisible()) {
      await registerBtn.click();
    } else {
      await p.goto('http://localhost:5173/onboarding');
    }
    await p.waitForTimeout(1000);
    // Fill out onboarding if possible
    // Let's just log the html to see what to do
    const html = await p.content();
    fs.writeFileSync('onboarding.html', html);
  });

  // 2. Login & Admin
  await checkErrors(page, 'Admin Login', async (p) => {
    await p.goto('http://localhost:5173/login');
    await p.fill('input[type="email"]', 'admin@demo.com');
    await p.fill('input[type="password"]', 'admin123');
    await p.click('button:has-text("Iniciar Sesión")');
    await p.waitForTimeout(1000);
    
    await p.goto('http://localhost:5173/admin');
    await p.waitForTimeout(1000);
    const html = await p.content();
    fs.writeFileSync('admin.html', html);
  });

  // 3. Chat
  await checkErrors(page, 'Chat Messaging', async (p) => {
    await p.goto('http://localhost:5173/chat');
    await p.waitForTimeout(1000);
    // click first chat
    const firstChat = p.locator('.chatItem, [role="button"]').first();
    if (await firstChat.isVisible()) await firstChat.click();
    await p.waitForTimeout(500);
    const input = p.locator('input[type="text"]').first();
    if (await input.isVisible()) {
      await input.fill('Hello world');
      await p.keyboard.press('Enter');
    }
    await p.waitForTimeout(500);
  });

  // 4. Rewards
  await checkErrors(page, 'Rewards Confetti', async (p) => {
    await p.goto('http://localhost:5173/rewards');
    await p.waitForTimeout(1000);
    const btn = p.locator('text="Quiero Ayudar"').first();
    if (await btn.isVisible()) {
      await btn.click();
      await p.waitForTimeout(500);
      const submit = p.locator('text="Enviar"').first();
      if (await submit.isVisible()) await submit.click();
    }
    await p.waitForTimeout(1000);
  });

  // 5. Q&A
  await checkErrors(page, 'QA Forum', async (p) => {
    await p.goto('http://localhost:5173/qanda');
    await p.waitForTimeout(1000);
    const thread = p.locator('.questionCard, [role="button"]').first();
    if (await thread.isVisible()) await thread.click();
    await p.waitForTimeout(500);
    const replyInput = p.locator('textarea').first();
    if (await replyInput.isVisible()) {
      await replyInput.fill('My helpful reply');
      await p.keyboard.press('Tab');
      await p.keyboard.press('Enter'); // submit reply?
    }
    await p.waitForTimeout(500);
  });

  await browser.close();
})();
