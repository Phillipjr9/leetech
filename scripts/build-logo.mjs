// Builds the LEETECH & AUTOS logo files as clean, transparent SVGs.
// The wordmark and tagline are drawn as outlines (no web font needed), so the
// logo renders identically in <img>, as a favicon, and when downloaded.
//
//   node scripts/build-logo.mjs
//
import { mkdirSync, writeFileSync } from "node:fs";

const n = (v) => Math.round(v * 100) / 100;

/* ---------- Squared, chamfered monoline lettering ---------- */
function glyph(ch, h, s) {
  const i = s / 2;
  const c = h * 0.21;
  const top = i;
  const bot = h - i;
  const mid = h * 0.5;
  const f = h / 48;
  const P = (...v) => v.map(n).join(",");
  switch (ch) {
    case "L": {
      const w = h * 1.04;
      return { w, d: `M${P(i, 0)}V${n(bot - c)}L${P(i + c, bot)}H${n(w)}` };
    }
    case "E": {
      const w = h * 1.2;
      return {
        w,
        d: `M${P(w, top)}H${n(i + c)}L${P(i, top + c)}V${n(bot - c)}L${P(i + c, bot)}H${n(w)}M${P(i, mid)}H${n(w - s)}`,
      };
    }
    case "C": {
      const w = h * 1.2;
      return {
        w,
        d: `M${P(w, top)}H${n(i + c)}L${P(i, top + c)}V${n(bot - c)}L${P(i + c, bot)}H${n(w)}`,
      };
    }
    case "T": {
      const w = h * 1.25;
      return { w, d: `M0,${n(top)}H${n(w)}M${P(w / 2, top)}V${n(h)}` };
    }
    case "H": {
      const w = h * 1.25;
      return {
        w,
        d: `M${P(i, 0)}V${n(h)}M${P(w - i, 0)}V${n(h)}M${P(i, mid)}H${n(w - i)}`,
      };
    }
    case "O": {
      const w = h * 1.25;
      return {
        w,
        d: `M${P(i + c, top)}H${n(w - i - c)}L${P(w - i, top + c)}V${n(bot - c)}L${P(w - i - c, bot)}H${n(i + c)}L${P(i, bot - c)}V${n(top + c)}Z`,
      };
    }
    case "A": {
      const w = h * 1.25;
      return {
        w,
        d: `M${P(i, h)}V${n(top + c)}L${P(i + c, top)}H${n(w - i - c)}L${P(w - i, top + c)}V${n(h)}M${P(i, h * 0.58)}H${n(w - i)}`,
      };
    }
    case "U": {
      const w = h * 1.25;
      return {
        w,
        d: `M${P(i, 0)}V${n(bot - c)}L${P(i + c, bot)}H${n(w - i - c)}L${P(w - i, bot - c)}V0`,
      };
    }
    case "S": {
      const w = h * 1.2;
      const q = h * 0.125;
      return {
        w,
        d: `M${P(w, top)}H${n(i + c)}L${P(i, top + c)}V${n(mid - q)}L${P(i + q, mid)}H${n(w - i - q)}L${P(w - i, mid + q)}V${n(bot - c)}L${P(w - i - c, bot)}H0`,
      };
    }
    case "G": {
      const w = h * 1.25;
      return {
        w,
        d: `M${P(w, top)}H${n(i + c)}L${P(i, top + c)}V${n(bot - c)}L${P(i + c, bot)}H${n(w - i)}V${n(mid)}H${n(w * 0.52)}`,
      };
    }
    case "D": {
      const w = h * 1.25;
      return {
        w,
        d: `M${P(i, top)}H${n(w - i - c)}L${P(w - i, top + c)}V${n(bot - c)}L${P(w - i - c, bot)}H${n(i)}Z`,
      };
    }
    case "R":
    case "P": {
      const w = h * 1.25;
      const m = h * 0.54;
      const bowl = `M${P(i, h)}V${n(top)}H${n(w - i - c)}L${P(w - i, top + c)}V${n(m - c)}L${P(w - i - c, m)}H${n(i)}`;
      return {
        w,
        d: ch === "R" ? `${bowl}M${P(w * 0.52, m)}L${P(w - i, h)}` : bowl,
      };
    }
    case "W": {
      const w = h * 1.5;
      return {
        w,
        d: `M${P(i, 0)}V${n(bot - c)}L${P(i + c, bot)}H${n(w - i - c)}L${P(w - i, bot - c)}V0M${P(w / 2, h * 0.3)}V${n(bot)}`,
      };
    }
    case "&": {
      const w = 64 * f;
      const q = (...v) => v.map((x) => n(x * f)).join(",");
      return {
        w,
        d: `M${q(56, 43.5)}L${q(17, 14.5)}L${q(24, 4.5)}H${n(36 * f)}L${q(43, 14.5)}V${n(18 * f)}L${q(13, 37)}L${q(19.5, 43.5)}H${n(34 * f)}L${q(45, 34)}V${n(26 * f)}`,
      };
    }
    case ".":
      return {
        w: s * 1.1,
        fill: true,
        d: `M0,${n(h - s * 1.1)}H${n(s * 1.1)}V${n(h)}H0Z`,
      };
    default:
      throw new Error(`No glyph for "${ch}"`);
  }
}

function lettering(text, { h, s, gap, space, x, y, width, color }) {
  let cursor = 0;
  const parts = [];
  let prevWasSpace = true;
  for (const ch of text) {
    if (ch === " ") {
      cursor += space;
      prevWasSpace = true;
      continue;
    }
    if (!prevWasSpace) cursor += gap;
    const g = glyph(ch, h, s);
    parts.push(
      `<path${g.fill ? ` fill="${color}" stroke="none"` : ""} transform="translate(${n(cursor)} 0)" d="${g.d}"/>`,
    );
    cursor += g.w;
    prevWasSpace = false;
  }
  const k = width / cursor;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(k * 1000) / 1000})" fill="none" stroke="${color}" stroke-width="${s}" stroke-linejoin="miter" stroke-miterlimit="4">${parts.join("")}</g>`;
}

/* ---------- Mark: phone rising behind a car in profile ---------- */
const CAR_INNER = `
    <!-- hood, windscreen and roof blade -->
    <path d="M248,716C296,683 358,658 430,645C482,621 560,592 640,587C720,583 800,597 850,611C800,606 718,608 650,613C575,620 512,636 452,653C390,664 312,686 248,716Z"/>
    <!-- shoulder, haunch and rear deck -->
    <path d="M452,653C540,659 625,654 668,643C735,626 800,617 850,611C888,620 950,625 1030,629C1008,641 1018,675 1027,712C1012,676 1000,650 972,643C935,640 905,646 880,658C850,676 800,684 740,684C640,684 520,664 452,653Z"/>
    <!-- rocker -->
    <path d="M568,686C650,693 770,690 828,679C848,675 860,668 866,660C858,678 845,692 818,698C760,707 650,704 568,686Z"/>
    <!-- wheel arch crescents -->
    <path d="M343,714C360,686 388,671 412,671C440,671 465,688 477,714C460,696 438,684 414,684C392,684 372,696 358,714Z"/>
    <path d="M858,704C868,676 896,661 926,661C958,661 985,680 992,705C976,688 954,674 928,674C902,674 880,688 872,704Z"/>
    <!-- front lip -->
    <path d="M283,717L298,711C312,708 328,706 342,705L340,712C322,713 303,715 283,717Z"/>
    <!-- mirror -->
    <path fill-rule="evenodd" d="M494,652C492,637 503,627 518,628C531,629 538,639 534,651C520,655 506,655 494,652ZM504,643C505,637 513,634 520,636C525,638 524,644 520,647C514,649 507,648 504,643Z"/>
  `;

/* ---------- Two colourways: both have a fully transparent background ---------- */
const THEMES = {
  // For dark backgrounds (the storefront itself).
  dark: {
    red: "#e4141b",
    car: "#e6e6e6",
    carStroke: "none",
    text: "#ffffff",
    tagline: "#e4141b",
    slot: "#f6dede",
  },
  // For light backgrounds (documents, print, white pages).
  light: {
    red: "#d9141c",
    car: "url(#carMetal)",
    carStroke: "#6f737b",
    text: "#1b1c21",
    tagline: "#c8121a",
    slot: "#ffffff",
  },
};

/* Phone rising behind the car. Dark: red outline. Light: glossy red handset. */
const phone = (t, theme) =>
  theme === "dark"
    ? `
  <g>
    <g transform="rotate(-12.4 675 470)">
      <path fill="${t.red}" d="M675,481a11,11 0 0 1 11,-11H851a11,11 0 0 1 11,11V497H675Z"/>
      <rect x="744" y="476" width="50" height="5" rx="2.5" fill="${t.slot}"/>
    </g>
    <path fill="${t.red}" d="M681,494L691,492L711,574L700,577Z"/>
    <path fill="${t.red}" d="M853,458L863,456L902,607L891,610Z"/>
  </g>`
    : `
  <g>
    <ellipse cx="775" cy="545" rx="150" ry="120" fill="url(#phoneGlow)"/>
    <path fill="url(#phoneBody)" d="M675,484a14,14 0 0 1 11,-14L850,447a14,14 0 0 1 15,11L903,607L700,579Z"/>
    <path fill="#17181c" d="M689,512L848,486L880,604L712,578Z"/>
    <path fill="#ffffff" fill-opacity=".16" d="M689,512L848,486L862,547L704,573Z"/>
    <rect x="745" y="470" width="52" height="5" rx="2.5" transform="rotate(-9.4 771 472)" fill="${t.slot}" fill-opacity=".92"/>
  </g>`;

const carShapes = (t) => `
  <g fill="${t.car}" stroke="${t.carStroke}" stroke-width="1.6" stroke-linejoin="round">${CAR_INNER}</g>`;

const defs = (theme) =>
  theme === "dark"
    ? ""
    : `<defs>
    <linearGradient id="carMetal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#c9ccd2"/><stop offset="1" stop-color="#8d9199"/>
    </linearGradient>
    <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff3a3f"/><stop offset="1" stop-color="#b80f16"/>
    </linearGradient>
    <radialGradient id="phoneGlow">
      <stop offset="0" stop-color="#ff2a30" stop-opacity=".34"/><stop offset="1" stop-color="#ff2a30" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

const mark = (theme) =>
  `${defs(theme)}${phone(THEMES[theme], theme)}${carShapes(THEMES[theme])}`;

const wordmark = (t) =>
  lettering("LEETECH & AUTOS", {
    h: 48,
    s: 9,
    gap: 14.4,
    space: 38,
    x: 143,
    y: 757,
    width: 1017,
    color: t.text,
  });
const tagline = (t) =>
  lettering("GADGETS. CARS. POWER.", {
    h: 28,
    s: 3.6,
    gap: 8,
    space: 20,
    x: 298,
    y: 841,
    width: 712,
    color: t.tagline,
  });

// Explicit width/height give every file an intrinsic size, so it opens correctly
// in browsers, design tools and when downloaded (a bare viewBox can render at 0x0).
// No background rect is ever drawn: the files are transparent.
const svg = (viewBox, body, label) => {
  const [, , w, h] = viewBox.split(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" role="img" aria-label="${label.replaceAll("&", "&amp;")}">${body}</svg>\n`;
};

mkdirSync("public", { recursive: true });
mkdirSync("src/assets/logo", { recursive: true });
// The app imports the files in src/assets/logo (bundled into the page, so they can
// never 404). The copies in public/ are for external use, e.g. sharing or print.
const emit = (name, content) => {
  writeFileSync(`src/assets/logo/${name}`, content);
  writeFileSync(`public/${name}`, content);
};

const FULL = "LEETECH & AUTOS. Gadgets. Cars. Power.";
const dark = THEMES.dark;
const light = THEMES.light;

// Full lockup for dark backgrounds.
emit(
  "leetech-logo.svg",
  svg(
    "120 410 1060 480",
    `${mark("dark")}${wordmark(dark)}${tagline(dark)}`,
    FULL,
  ),
);
// Header lockup: same logo without the tagline, so it stays legible when small.
emit(
  "leetech-logo-compact.svg",
  svg(
    "120 410 1060 412",
    `${mark("dark")}${wordmark(dark)}`,
    "LEETECH & AUTOS",
  ),
);
// Full lockup for light backgrounds.
emit(
  "leetech-logo-light.svg",
  svg(
    "120 410 1060 480",
    `${mark("light")}${wordmark(light)}${tagline(light)}`,
    FULL,
  ),
);
// Favicon: the car-and-phone mark on the brand black.
emit(
  "favicon.svg",
  svg(
    "0 0 64 64",
    `<rect width="64" height="64" rx="14" fill="#0b0b0d"/><g transform="translate(-8 -3.8) scale(.0625)">${mark("dark")}</g>`,
    "LEETECH & AUTOS",
  ),
);
console.log(
  "Wrote leetech-logo.svg, leetech-logo-compact.svg, leetech-logo-light.svg and favicon.svg",
);
