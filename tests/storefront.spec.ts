import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Wait for React to mount so the first interaction is not lost during hydration.
  await expect(page.locator(".hero-image")).toBeVisible();
});

test("the cinematic storefront renders every section without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(page).toHaveTitle(/LEETECH.*AUTOS/);
  await expect(page.locator("h1")).toContainText("LEETECH");
  await expect(page.locator(".hero-image")).toHaveAttribute(
    "alt",
    /Official Land Rover image/,
  );
  await expect(
    page.getByRole("heading", { name: "GADGETS. CARS. POWER." }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() =>
      ["Manrope", "Space Grotesk", "Instrument Serif"].every((font) =>
        document.fonts.check(`16px "${font}"`),
      ),
    ),
  ).toBe(true);
  await expect(page.locator(".category-button")).toHaveCount(6);
  await expect(page.locator(".product-card")).toHaveCount(4);
  await expect(page.locator(".promo-block")).toHaveCount(2);
  await expect(page.locator(".benefit")).toHaveCount(6);
  await expect(page.locator(".review")).toHaveCount(3);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: /The privilege of being first/ }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("every category shows the matching collection", async ({ page }) => {
  for (const [name, count] of [
    ["Phones", 4],
    ["Laptops", 4],
    ["Accessories", 6],
    ["Cars", 12],
    ["New cars", 3],
    ["Used cars", 9],
  ] as const) {
    await page
      .locator(".category-button")
      .getByText(name, { exact: true })
      .click();
    await expect(page.locator(".product-card")).toHaveCount(count);
    await expect(page.locator("#bestsellers-title")).toHaveText(
      `${name.toUpperCase()}.`,
    );
  }
  await page.getByRole("button", { name: "View all products" }).click();
  await expect(page.locator(".product-card")).toHaveCount(26);
  await page.getByRole("button", { name: "Show best sellers" }).click();
  await expect(page.locator(".product-card")).toHaveCount(4);
});

test("search supports live results, empty states and product details", async ({
  page,
}) => {
  await page.keyboard.press("/");
  const search = page.getByRole("textbox", { name: "Search our collection" });
  await search.fill("macbook");
  await expect(page.locator(".search-result")).toHaveCount(4);
  await page
    .locator(".search-result")
    .filter({ has: page.locator("strong", { hasText: /^MacBook Air 13-inch$/ }) })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("Apple M1 chip");
  await expect(page.getByRole("dialog")).toContainText("256GB SSD storage");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Search products", exact: true })
    .click();
  await search.fill("nothing-matches-this");
  await expect(page.getByText("No matches just yet.")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".search-result")).toHaveCount(4);
});

test("the bag updates quantities and persists across reloads", async ({
  page,
}) => {
  await page.locator(".product-cta").nth(0).click();
  await page.locator(".product-cta").nth(0).click();
  await page.locator(".product-cta").nth(1).click();
  await page
    .getByRole("button", { name: "Open shopping bag, 3 items" })
    .click();
  await expect(page.locator(".cart-item")).toHaveCount(2);
  await expect(page.locator(".cart-summary")).toContainText("6,050,000");
  await page
    .getByRole("button", { name: "Decrease iPhone 15 Pro Max quantity" })
    .click();
  await expect(page.locator(".cart-summary")).toContainText("4,200,000");
  await page.reload();
  await page
    .getByRole("button", { name: "Open shopping bag, 2 items" })
    .click();
  await expect(page.locator(".cart-item")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Remove iPhone 16 Pro Max", exact: true })
    .click();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Remove iPhone 15 Pro Max", exact: true })
    .click();
  await expect(
    page.getByText("Your next upgrade", { exact: false }).last(),
  ).toBeVisible();
  await expect(page.locator(".cart-item")).toHaveCount(0);
});

test("wishlist selections persist and can be removed from the saved collection", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Save iPhone 15 Pro Max to wishlist" })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Remove iPhone 15 Pro Max from wishlist",
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await page
    .getByRole("button", { name: "Wishlist, 1 saved products" })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Remove iPhone 15 Pro Max from wishlist" })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(0);
  await expect(
    page.getByText("Your next favourites are waiting."),
  ).toBeVisible();
});

test("checkout validates details and creates a clearly labelled local demo order", async ({
  page,
}) => {
  await page.locator(".product-cta").first().click();
  await page
    .getByRole("button", { name: "Open shopping bag, 1 items" })
    .click();
  await page.getByRole("button", { name: "Continue to checkout" }).click();
  await page.getByRole("button", { name: "Create demo order" }).click();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await page.getByLabel("Full name").fill("Ada Okafor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("ada@example.com");
  await page.getByLabel("Phone number").fill("08012345678");
  await page.getByLabel("Delivery state").selectOption("Lagos");
  await page.getByLabel("Delivery address").fill("12 Example Street, Ikeja");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create demo order" }).click();
  await expect(page.getByText("DEMO ORDER CREATED")).toBeVisible();
  await expect(page.getByText(/No payment has been taken/)).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("leetech-last-order") || "{}").demo,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("leetech-cart") || "[]"),
    ),
  ).toEqual([]);
});

test("vehicle shoppers can prepare an inspection request", async ({ page }) => {
  await page
    .locator(".category-button")
    .getByText("Cars", { exact: true })
    .click();
  await page
    .getByRole("button", { name: "Explore vehicle", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Book an inspection" }).click();
  await page.getByLabel("Full name").fill("Tunde Bello");
  await page.getByLabel("Phone number").fill("08012345678");
  const nextWeek = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .slice(0, 10);
  await page.getByLabel("Preferred date").fill(nextWeek);
  await page.getByLabel("Preferred time").selectOption("12:00 PM");
  await page.getByRole("button", { name: "Save inspection request" }).click();
  await expect(page.getByText("INSPECTION REQUEST SAVED")).toBeVisible();
  await expect(
    page.getByText(/a live appointment has not been booked/),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("leetech-inspection") || "{}").vehicle,
    ),
  ).toBe("Mercedes-AMG GLE 53");
});

test("newsletter signup validates email and remembers the preference", async ({
  page,
}) => {
  await page
    .getByLabel("Your email address", { exact: true })
    .fill("not-an-email");
  await page
    .getByRole("button", { name: "Subscribe to the newsletter" })
    .click();
  await expect(page.locator(".newsletter-success")).toHaveCount(0);
  await page
    .getByLabel("Your email address", { exact: true })
    .fill("hello@example.com");
  await page
    .getByRole("button", { name: "Subscribe to the newsletter" })
    .click();
  await expect(page.locator(".newsletter-success")).toContainText(
    "hello@example.com",
  );
  await page.reload();
  await expect(page.locator(".newsletter-success")).toContainText(
    "hello@example.com",
  );
  await page.getByRole("button", { name: "Use a different email" }).click();
  await expect(
    page.getByLabel("Your email address", { exact: true }),
  ).toBeVisible();
});

test("brand and support information is available without leaving the storefront", async ({
  page,
}) => {
  await page.getByRole("button", { name: "About us", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "One brand. More possibilities.",
  );
  for (const name of [
    "Download for dark backgrounds (SVG)",
    "Download for light backgrounds (SVG)",
  ]) {
    const link = page.getByRole("link", { name });
    await expect(link).toHaveAttribute("href", /^data:image\/svg\+xml/);
    await expect(link).toHaveAttribute("download", /\.svg$/);
  }
  for (const name of [
    "Download for dark backgrounds (PNG)",
    "Download for light backgrounds (PNG)",
  ]) {
    await expect(page.getByRole("button", { name })).toBeVisible();
  }
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "FAQs", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Can I inspect a vehicle?",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Payment options", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "never collects card details",
  );
});

test("dialogs focus the input, contain keyboard focus, and close with Escape", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Search products", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Search our collection" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Close dialog" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".search-result").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Search products", exact: true }),
  ).toBeFocused();
});

test("weekly deals filter discounted products and show a live countdown", async ({
  page,
}) => {
  const timer = page.getByRole("timer");
  const before = await timer.textContent();
  await page.waitForTimeout(1200);
  expect(await timer.textContent()).not.toEqual(before);
  await page.getByRole("button", { name: "Shop the drop" }).click();
  await expect(page.locator("#bestsellers-title")).toHaveText(
    "THE WEEKLY DROP.",
  );
  await expect(page.locator(".product-card")).toHaveCount(8);
  await expect(page.locator(".product-price del")).toHaveCount(8);
});

test("mobile navigation works and all target widths remain free of horizontal overflow", async ({
  page,
}) => {
  for (const width of [320, 390, 600, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth), {
        message: `Overflow at ${width}px`,
      })
      .toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.locator(".mobile-nav")).toBeVisible();
  await page
    .locator(".mobile-nav")
    .getByRole("button", { name: "Cars", exact: true })
    .click();
  await expect(page.locator(".mobile-nav")).toHaveCount(0);
  await expect(page.locator(".product-card")).toHaveCount(12);
  await expect(page.locator("#bestsellers-title")).toHaveText("CARS.");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-nav")).toHaveCount(0);
});

test("mobile shoppers can complete the bag and checkout flow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Shop gadgets", exact: true }).click();
  await page.locator(".product-cta").first().click();
  await page
    .getByRole("button", { name: "Open shopping bag, 1 items" })
    .click();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await page.getByRole("button", { name: "Continue to checkout" }).click();
  await page.getByLabel("Full name").fill("Ada Okafor");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("mobile@example.com");
  await page.getByLabel("Phone number").fill("+2348012345678");
  await page.getByLabel("Delivery state").selectOption("FCT Abuja");
  await page.getByLabel("Delivery address").fill("12 Example Road, Abuja");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create demo order" }).click();
  await expect(page.getByText("DEMO ORDER CREATED")).toBeVisible();
  await page.getByRole("button", { name: "Back to the good stuff" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Open shopping bag, 0 items" }),
  ).toBeVisible();
});

test("all displayed product images are official, background-free cut-outs", async ({
  page,
}) => {
  await page.getByRole("button", { name: "View all products" }).click();
  const images = await page.locator(".product-card img").all();
  expect(images.length).toBeGreaterThanOrEqual(13);
  for (const image of images) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => (element as HTMLImageElement).decode());
    expect(
      await image.evaluate(
        (element) => (element as HTMLImageElement).naturalWidth,
      ),
    ).toBeGreaterThan(0);
  }
  await expect(page.getByText(/pexels/i)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Photography credits" }),
  ).toHaveCount(0);
  await expect(page.locator(".photography-credit")).toHaveCount(0);
});

test("shoppers can configure gadgets, add vehicles to bag, and swap or sell gadgets and cars", async ({
  page,
}) => {
  // 1) Configure a vehicle and add its 10% reservation deposit to the bag
  await page
    .locator(".category-button")
    .getByText("Cars", { exact: true })
    .click();
  await page
    .getByRole("button", { name: "Explore vehicle", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: /10% Refundable Reservation Deposit/ })
    .click();
  await page.getByRole("button", { name: "Add vehicle to bag" }).click();
  await page.keyboard.press("Escape");

  // 2) Open the Swap & Buyout Desk, swap a gadget toward an iPhone 16 Pro Max, and add to bag
  await page.getByRole("button", { name: "Swap & sell" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "SWAP OR SELL YOUR GADGET OR CAR.",
  );
  await page
    .getByRole("button", { name: /Apply swap & add upgrade to bag/ })
    .click();
  await expect(page.locator(".cart-item")).toHaveCount(2);
  await expect(page.locator(".cart-items")).toContainText("Swapped:");
  await page.keyboard.press("Escape");

  // 3) Sell a vehicle outright to LEETECH
  await page.getByRole("button", { name: "Sell car outright" }).click();
  await page.getByLabel("Your full name").fill("Emeka Nwosu");
  await page.getByLabel("Phone / WhatsApp number").fill("08091234567");
  await page.getByRole("button", { name: /Lock in cash buyout offer/ }).click();
  await expect(
    page.getByText("DIRECT BUYOUT / SWAP VALUATION SAVED"),
  ).toBeVisible();
});

test("the LEETECH & AUTOS logo renders in the header and footer", async ({
  page,
}) => {
  const headerLogo = page.locator(".site-header .brand img");
  await expect(headerLogo).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await headerLogo.evaluate((img) => (img as HTMLImageElement).decode());
  expect(
    await headerLogo.evaluate((img) => (img as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  const box = await headerLogo.boundingBox();
  expect(box!.height).toBeGreaterThan(40);
  expect(box!.height).toBeLessThan(80);

  const footerLogo = page.locator(".site-footer .footer-brand img");
  await footerLogo.scrollIntoViewIfNeeded();
  await expect(footerLogo).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await footerLogo.evaluate((img) => (img as HTMLImageElement).decode());
  expect(
    await footerLogo.evaluate((img) => (img as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);

  await page.setViewportSize({ width: 390, height: 844 });
  // Poll: the header logo resizes after the viewport change, so wait for the layout to settle.
  await expect
    .poll(async () => (await headerLogo.boundingBox())?.width ?? Infinity)
    .toBeLessThanOrEqual(112);
  const mobileHeaderBox = await headerLogo.boundingBox();
  expect(mobileHeaderBox!.height).toBeLessThanOrEqual(45);
  await footerLogo.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => (await footerLogo.boundingBox())?.width ?? Infinity)
    .toBeLessThanOrEqual(180);

  for (const file of [
    "leetech-logo.svg",
    "leetech-logo-compact.svg",
    "favicon.svg",
  ]) {
    const response = await page.request.get(`/${file}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("<svg");
  }
});

test("logo downloads are transparent PNGs with the background removed", async ({
  page,
}) => {
  await page.getByRole("button", { name: "About us", exact: true }).click();
  for (const [name, file] of [
    ["Download for dark backgrounds (PNG)", "leetech-and-autos-logo.png"],
    [
      "Download for light backgrounds (PNG)",
      "leetech-and-autos-logo-light.png",
    ],
  ]) {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(file);
    const bytes = readFileSync((await download.path())!);
    // PNG signature, then IHDR colour type 6 = truecolour with an alpha channel.
    expect(bytes.subarray(1, 4).toString()).toBe("PNG");
    expect(bytes.readUInt8(25)).toBe(6);
    // Real pixel check: all four corners of the exported file are fully transparent.
    const corners = await page.evaluate(async (base64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const alpha = (px: number, py: number) =>
        ctx.getImageData(px, py, 1, 1).data[3];
      return {
        size: [img.naturalWidth, img.naturalHeight],
        corners: [
          alpha(2, 2),
          alpha(canvas.width - 3, 2),
          alpha(2, canvas.height - 3),
          alpha(canvas.width - 3, canvas.height - 3),
        ],
      };
    }, bytes.toString("base64"));
    expect(corners.size[0]).toBe(2400);
    expect(corners.corners).toEqual([0, 0, 0, 0]);
  }
});

test("the SVG logos have no background rectangle", async ({ page }) => {
  for (const file of [
    "leetech-logo.svg",
    "leetech-logo-compact.svg",
    "leetech-logo-light.svg",
  ]) {
    const svg = await (await page.request.get(`/${file}`)).text();
    expect(svg).toContain("<svg");
    expect(svg).not.toMatch(/<rect[^>]*width="(1060|100%)"/);
  }
});

test("phone number 09138130976 and TikTok leetech.autos render with icons", async ({
  page,
}) => {
  const utilityPhone = page.locator('.utility-bar a[href="tel:09138130976"]');
  await expect(utilityPhone).toContainText("09138130976");
  await expect(utilityPhone.locator("svg")).toBeVisible();

  const utilityTiktok = page.locator(
    '.utility-bar a[href="https://www.tiktok.com/@leetech.autos"]',
  );
  await expect(utilityTiktok).toContainText("leetech.autos");
  await expect(utilityTiktok.locator("svg")).toBeVisible();

  const footerPhone = page.locator('.site-footer a[href="tel:09138130976"]');
  await footerPhone.scrollIntoViewIfNeeded();
  await expect(footerPhone).toContainText("09138130976");
  await expect(footerPhone.locator("svg")).toBeVisible();

  const footerTiktok = page
    .locator('.site-footer a[href="https://www.tiktok.com/@leetech.autos"]')
    .first();
  await expect(footerTiktok).toContainText("leetech.autos");
  await expect(footerTiktok.locator("svg")).toBeVisible();
});

test("the homepage prominently showcases current devices before shopping categories", async ({
  page,
}) => {
  const showcase = page.getByRole("region", { name: /Latest devices/ });
  await expect(
    showcase.getByRole("heading", { name: "iPhone 18 Pro Max", exact: true }),
  ).toBeVisible();
  await expect(showcase.getByRole("tab")).toHaveCount(4);
  await expect(
    showcase.getByRole("tab", { name: "iPhone 18 Pro Max", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  expect(
    await page.evaluate(() => {
      const latest = document.getElementById("latest-devices")!;
      const categories = document.querySelector(".categories-section")!;
      return Boolean(
        latest.compareDocumentPosition(categories) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
  ).toBe(true);
  await showcase
    .locator(".latest-visual img")
    .evaluate((image) => (image as HTMLImageElement).decode());
  await expect(showcase.locator(".latest-visual img")).toHaveAttribute(
    "src",
    /apple\.com.*iphone-18-pro/,
  );
  await expect(showcase).not.toContainText("iPhone 15");
  await expect(showcase).not.toContainText("In stock");
});

test("latest-device tabs show actual manufacturer images and support keyboard navigation", async ({
  page,
}) => {
  const showcase = page.locator("#latest-devices");
  for (const name of [
    "Galaxy S26 Ultra",
    "iPhone 18 Pro",
    "MacBook Pro 14-inch M6",
    "iPhone 18 Pro Max",
  ]) {
    await showcase.getByRole("tab", { name, exact: true }).click();
    await expect(
      showcase.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    await showcase
      .locator(".latest-visual img")
      .evaluate((image) => (image as HTMLImageElement).decode());
    expect(
      await showcase
        .locator(".latest-visual img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(500);
  }
  await showcase
    .getByRole("tab", { name: "iPhone 18 Pro Max", exact: true })
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    showcase.getByRole("tab", { name: "Galaxy S26 Ultra", exact: true }),
  ).toBeFocused();
  await expect(
    showcase.getByRole("tab", { name: "Galaxy S26 Ultra", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    showcase.getByRole("tab", { name: "MacBook Pro 14-inch M6", exact: true }),
  ).toBeFocused();
  await expect(showcase).toContainText("Available from November 6, 2026");
});

test("a configured latest-device enquiry includes the exact model finish and capacity", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Explore iPhone 18 Pro Max", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Price on request");
  await expect(dialog).toContainText("A20 Pro");
  await expect(dialog).not.toContainText("In stock");
  await expect(dialog).not.toContainText("Add to bag");
  await dialog.getByRole("button", { name: "Glacier", exact: true }).click();
  await dialog.getByLabel("Preferred configuration").selectOption("1TB");
  const enquiryUrl = new URL(
    (await dialog
      .getByRole("link", { name: "Enquire on WhatsApp" })
      .getAttribute("href"))!,
  );
  expect(enquiryUrl.hostname).toBe("wa.me");
  expect(enquiryUrl.pathname).toBe("/2349138130976");
  expect(enquiryUrl.searchParams.get("text")).toContain("iPhone 18 Pro Max");
  expect(enquiryUrl.searchParams.get("text")).toContain("Glacier");
  expect(enquiryUrl.searchParams.get("text")).toContain("1TB");
  await expect(
    dialog.getByRole("link", { name: "Official specifications" }),
  ).toHaveAttribute("href", "https://www.apple.com/iphone-18-pro/specs/");
  await expect(
    dialog.getByRole("link", { name: "Call 09138130976" }),
  ).toHaveAttribute("href", "tel:09138130976");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("latest devices are searchable and labelled accurately when announced", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Search products", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search our collection" })
    .fill("iphone 18");
  await expect(page.locator(".search-result")).toHaveCount(2);
  await page
    .locator(".search-result")
    .filter({ hasText: "iPhone 18 Pro Max" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Price on request");
  await page.keyboard.press("Escape");
  await page
    .locator("#latest-devices")
    .getByRole("tab", { name: "MacBook Pro 14-inch M6" })
    .click();
  await page
    .getByRole("button", { name: "Explore MacBook Pro 14-inch M6" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("November 6, 2026");
  await expect(page.getByRole("dialog")).toContainText(
    "not yet confirmed by LEETECH",
  );
});

test("the latest-device showcase and enquiry work on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("button", { name: "Latest devices", exact: true })
    .click();
  await expect(page.locator(".mobile-nav")).toHaveCount(0);
  await expect(page.locator("#latest-devices-title")).toBeInViewport();
  await page
    .getByRole("button", { name: "Explore iPhone 18 Pro Max", exact: true })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "iPhone 18 Pro Max", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Preferred configuration").selectOption("512GB");
  await expect(
    page.getByRole("link", { name: "Enquire on WhatsApp" }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
