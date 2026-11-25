// Smoke test for the static export (checklists/qa.md).
// 1. Serves out/ locally. 2. Visits every route at 1440x900, 390x844, 375x667 and fails on
// horizontal scroll, console errors or page errors. 3. Runs the end-to-end demo: client sends a
// brief → it reaches the lawyer inbox → accepted as pro bono → hours logged → shown on ULAS.
// 4. Saves screenshots to docs/screens/. Run after `npm run build`: npm run smoke
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const OUT = "out";
const SHOTS = "docs/screens";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
if (!existsSync(OUT)) { console.error("Run npm run build first."); process.exit(1); }
mkdirSync(SHOTS, { recursive: true });

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = join(OUT, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": TYPES[extname(f)] ?? "application/octet-stream" });
  createReadStream(f).pipe(res);
}).listen(0);
const BASE = `http://localhost:${server.address().port}`;

const ROUTES = ["/", "/describe/", "/describe/review/", "/sent/", "/find/", "/find/?area=family&near=Cubao%20(Socorro)", "/find/l05/", "/for-lawyers/",
  "/app/inbox/", "/app/inbox/brief/?id=b03", "/app/ulas/", "/app/ulas/report/", "/app/firm/", "/app/bookings/", "/app/account/", "/admin/verification/"];
const SIZES = [[1440, 900], [390, 844], [375, 667]];
const failures = [];
const fail = (m) => { failures.push(m); console.log("  FAIL", m); };

const browser = await chromium.launch();
// OpenStreetMap tiles are not reachable from CI sandboxes; serve a blank tile so the map code
// still runs. A real browser loads the real tiles.
const BLANK_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "base64");
const stubTiles = (ctx) => ctx.route("https://tile.openstreetmap.org/**", (r) => r.fulfill({ status: 200, contentType: "image/png", body: BLANK_PNG }));

// 1. Every route, every size
for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await stubTiles(ctx);
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  page.on("pageerror", (e) => errs.push(String(e)));
  for (const r of ROUTES) {
    errs.length = 0;
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) fail(`${w}px ${r}: horizontal scroll (${sw}px)`);
    if (errs.length) fail(`${w}px ${r}: console errors: ${errs.join(" | ").slice(0, 300)}`);
    const small = await page.evaluate(() => [...document.querySelectorAll("a.btn, button.btn, label:has(> input[type=radio]), select, .input")]
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 38; }).length);
    if (small) fail(`${w}px ${r}: ${small} controls under 38px tall`);
  }
  console.log(`ok   ${w}x${h}: ${ROUTES.length} routes visited`);
  await ctx.close();
}

// 2. End-to-end demo at desktop size
// Wait for count-ups and fades to settle so screenshots show final values.
const shot = async (page, name) => { await page.waitForTimeout(900); await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false }); };
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const step = async (name, fn) => { try { await fn(); console.log(`ok   e2e: ${name}`); } catch (e) { fail(`e2e ${name}: ${String(e).split("\n")[0]}`); } };

  await step("home renders and switches to Filipino", async () => {
    await page.goto(BASE + "/");
    await shot(page, "01-client-home");
    await page.getByRole("radio", { name: "Filipino" }).check();
    await page.getByRole("heading", { name: /Ikuwento ang problema mo/ }).waitFor();
    await shot(page, "01b-client-home-filipino");
    await page.getByRole("radio", { name: "English" }).check();
  });
  await step("consent needs three yes answers", async () => {
    await page.goto(BASE + "/describe/");
    const cont = page.getByRole("button", { name: "Continue" });
    if (!(await cont.isDisabled())) throw new Error("Continue enabled before consent");
    for (const r of await page.getByRole("radio", { name: "Yes" }).all()) await r.check();
    await shot(page, "02-consent");
    await cont.click();
  });
  await step("story with example finds personal details", async () => {
    await page.getByRole("button", { name: "Fill in an example" }).click();
    await page.getByRole("button", { name: "Check for personal details" }).click();
    await page.getByText(/details will be hidden/).waitFor();
    await shot(page, "03-redaction");
    await page.getByRole("button", { name: "Make my brief" }).click();
    await page.waitForURL("**/describe/review/", { timeout: 10000 });
  });
  await step("brief review shows notice and template line", async () => {
    await page.getByRole("heading", { name: "This is what a lawyer will see" }).waitFor();
    if (!(await page.locator("[data-notice]").count())) throw new Error("no info-not-advice notice");
    await page.getByText("made from a template, not by AI").waitFor();
    if (await page.getByText("0917").count()) throw new Error("phone number not redacted in brief");
    await shot(page, "04-brief-review");
  });
  await step("choose a lawyer and send", async () => {
    await page.getByRole("link", { name: "Choose a lawyer" }).click();
    await page.getByText("Your brief is ready").waitFor();
    await shot(page, "05-directory");
    await page.getByRole("link", { name: "Atty. Andrea Villanueva" }).click();
    await page.getByRole("button", { name: /Send my brief to Atty. Andrea Villanueva/ }).click();
    await page.getByRole("heading", { name: "Your brief was sent" }).waitFor();
  });
  await step("brief arrives in the lawyer inbox", async () => {
    await page.goto(BASE + "/app/inbox/");
    await page.getByRole("heading", { name: /5 new briefs/ }).waitFor();
    await page.getByText(/From this demo/).first().waitFor();
    await shot(page, "06-lawyer-inbox");
    await page.locator("li", { has: page.getByText(/From this demo/) }).getByRole("link").first().click();
  });
  await step("accept is locked until conflict check, then accept as pro bono", async () => {
    const acc = page.getByRole("button", { name: "Accept as pro bono" });
    if (!(await acc.isDisabled())) throw new Error("accept enabled before conflict check");
    await page.getByRole("radio", { name: "No conflict" }).check();
    await shot(page, "07-brief-decision");
    await acc.click();
    await page.getByText("You accepted this as pro bono.").waitFor();
  });
  await step("schedule and close the appointment, log 2 hours", async () => {
    await page.goto(BASE + "/app/bookings/");
    const row = page.locator("li", { has: page.getByText("From this demo") }).first();
    await row.getByRole("button", { name: "Schedule" }).click();
    await row.getByRole("button", { name: "Save" }).click();
    await row.getByRole("button", { name: "Close appointment" }).click();
    await row.getByLabel("How long did this take?").fill("2");
    await row.getByRole("button", { name: "Close and log hours" }).click();
    await row.getByText(/2 hours logged to ULAS/).waitFor();
    await shot(page, "08-bookings");
  });
  await step("ULAS shows 24 of 60 hours", async () => {
    await page.goto(BASE + "/app/ulas/");
    await page.getByRole("heading", { name: /^24 of 60 hours\./ }).waitFor();
    await shot(page, "09-ulas");
    await page.goto(BASE + "/app/ulas/report/");
    await shot(page, "10-ulas-report");
  });
  await step("lawyer landing and firm view render", async () => {
    await page.goto(BASE + "/for-lawyers/");
    await shot(page, "11-for-lawyers");
    await page.goto(BASE + "/app/firm/");
    await page.getByRole("heading", { name: /2 of 4 covered lawyers/ }).waitFor();
    await shot(page, "12-firm");
  });
  await ctx.close();
}

// 3. Near you (Quezon City pilot): GPS inside QC, area picker, outside QC, denied, phone map
{
  const DILIMAN = { latitude: 14.656, longitude: 121.065 };
  const run = async (name, opts, fn) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ...opts });
    await stubTiles(ctx);
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(String(e)));
    try { await fn(page); if (errs.length) throw new Error(errs.join(" | ")); console.log(`ok   near: ${name}`); }
    catch (e) { fail(`near ${name}: ${String(e).split("\n")[0]}`); }
    await ctx.close();
  };
  await run("GPS in Diliman finds the nearest family office and draws the map", { permissions: ["geolocation"], geolocation: DILIMAN }, async (page) => {
    await page.goto(BASE + "/find/?area=family");
    await page.getByRole("button", { name: "Use my location" }).click();
    await page.getByText(/Nearest office for family matters: Dela Paz Law Office, Diliman/).waitFor();
    await page.locator(".leaflet-container").waitFor();
    const markers = await page.locator("path.leaflet-interactive").count();
    if (markers < 11) throw new Error(`expected 11+ office markers, got ${markers}`);
    if (page.url().includes("14.6") || page.url().includes("121.0")) throw new Error("GPS position leaked into the URL");
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
    if (/14\.65|121\.06/.test(stored)) throw new Error("GPS position stored in the browser");
    const first = await page.locator("ul li article h2").first().innerText();
    if (!/Dela Paz/.test(first)) throw new Error(`first card should be the nearest family lawyer, got ${first}`);
    await shot(page, "17-near-you-map");
  });
  await run("choosing an area needs no GPS and goes in the URL", {}, async (page) => {
    await page.goto(BASE + "/find/");
    await page.getByLabel("Your barangay or area in Quezon City").selectOption("Fairview");
    await page.getByText(/Nearest office: Fernandez Law Office, Fairview/).waitFor();
    if (!page.url().includes("near=Fairview")) throw new Error("area not in URL");
  });
  await run("GPS outside Quezon City is not used", { permissions: ["geolocation"], geolocation: { latitude: 14.5547, longitude: 121.0244 } }, async (page) => {
    await page.goto(BASE + "/find/");
    await page.getByRole("button", { name: "Use my location" }).click();
    await page.getByText(/outside Quezon City/).waitFor();
    if (await page.locator(".leaflet-container").count()) throw new Error("map shown for a location outside the pilot");
  });
  await run("denied location falls back to choosing an area", {}, async (page) => {
    await page.goto(BASE + "/find/");
    await page.getByRole("button", { name: "Use my location" }).click();
    await page.getByText(/location is off or was not allowed/).waitFor({ timeout: 15000 });
  });
  await run("phone shows a List/Map toggle and loads the map only on demand", { viewport: { width: 390, height: 844 }, hasTouch: true }, async (page) => {
    await page.goto(BASE + "/find/?near=Cubao%20(Socorro)");
    await page.getByText(/Nearest office: Bautista Law Office, Cubao/).waitFor();
    if (await page.locator(".leaflet-container").count()) throw new Error("map loaded before it was asked for");
    await page.getByRole("radio", { name: "Map" }).check();
    await page.locator(".leaflet-container").waitFor();
    await shot(page, "18-phone-near-you-map");
  });
}

// 4. Phone: bottom sheet on the brief and the tab bar
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + "/app/inbox/brief/?id=b03");
    await page.getByText("Decide on this brief").waitFor();
    if (await page.getByRole("radio", { name: "No conflict" }).isVisible()) throw new Error("sheet open before tap");
    await shot(page, "13-phone-brief-peek");
    await page.getByRole("button", { name: "Show decision" }).click();
    await page.getByRole("radio", { name: "No conflict" }).waitFor({ state: "visible" });
    await shot(page, "14-phone-brief-open");
    await page.goto(BASE + "/");
    await shot(page, "15-phone-home");
    await page.goto(BASE + "/app/ulas/");
    await shot(page, "16-phone-ulas");
    console.log("ok   phone: bottom sheet and tab bar");
  } catch (e) { fail(`phone: ${String(e).split("\n")[0]}`); }
  await ctx.close();
}

await browser.close();
server.close();
if (failures.length) { console.error(`\n${failures.length} smoke failure(s).`); process.exit(1); }
console.log("\nSmoke test passed.");
