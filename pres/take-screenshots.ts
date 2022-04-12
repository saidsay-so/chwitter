import { mkdir, writeFile } from "fs/promises";
import { Browser, chromium, devices } from "playwright";

const takeWebsiteScreenshots = async (
  deviceName: keyof typeof devices,
  alias: string,
  browser: Browser
) => {
  const device = devices[deviceName];
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();
  await page.goto("http://localhost:3000");

  await mkdir("screenshots", { recursive: true });

  await page.screenshot({ path: `screenshots/login-${alias}.png` });

  await page.fill('input[name="login"]', "a");
  await page.fill('input[name="password"]', "a");
  await page.click("form.input-container div.buttons button.button", {
    force: true,
  });

  // await context.storageState({ path: "state.json" });

  await page.waitForTimeout(2000);
  await page.screenshot({ path: `screenshots/home-${alias}.png` });

  await page.click(".panel .avatar a");
  await page.waitForTimeout(2000);

  await page.screenshot({ path: `screenshots/profile-msg-${alias}.png` });

  await page.click("nav.profile-nav a.profile-link:nth-child(2)");
  await page.waitForTimeout(2000);

  await page.screenshot({ path: `screenshots/profile-friends-${alias}.png` });
};

(async () => {
  const browser = await chromium.launch();
  // const context = await browser.newContext({ storageState: "state.json" });

  await takeWebsiteScreenshots("iPhone 11 Pro Max", "mobile", browser);
  await takeWebsiteScreenshots("Desktop Chrome HiDPI", "desktop", browser);

  await browser.close();
})();
