export type LatestDevice = {
  id: string;
  name: string;
  maker: string;
  category: string;
  shortName: string;
  edition: string;
  headline: string;
  description: string;
  image: string;
  detailImage: string;
  imageAlt: string;
  sourceUrl: string;
  sourceLabel: string;
  specs: string[];
  finishes: { name: string; hex: string }[];
  configurations: string[];
  releaseNote: string;
};

const iphoneSource = "https://www.apple.com/iphone-18-pro/specs/";
const iphoneImageBase =
  "https://www.apple.com/v/iphone-18-pro/d/images/overview/product-viewer/";

// Product information is manufacturer-verified; no LEETECH stock or price is implied.
export const latestDevices: LatestDevice[] = [
  {
    id: "iphone-18-pro-max",
    name: "iPhone 18 Pro Max",
    maker: "Apple",
    category: "SMARTPHONES",
    shortName: "18 Pro Max",
    edition: "2026 PRO COLLECTION",
    headline: "A new level of extraordinary.",
    description:
      "A20 Pro power. A remarkable 48MP camera with variable aperture. All in a beautifully refined aluminum unibody.",
    image: `${iphoneImageBase}color_burgundy__f95it7a6dnyq_large.jpg`,
    detailImage:
      "https://www.apple.com/newsroom/images/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/article/Apple-iPhone-18-Pro-2up-260909_inline.jpg.large.jpg",
    imageAlt:
      "Official Apple image of the burgundy iPhone 18 Pro camera and aluminum enclosure",
    sourceUrl: iphoneSource,
    sourceLabel: "Apple / iPhone 18 Pro technical specifications",
    specs: [
      "6.9-inch Super Retina XDR display with ProMotion",
      "A20 Pro chip with a 7-core GPU",
      "48MP Pro Fusion camera system with variable aperture",
      "Up to 45 hours of video playback, according to Apple",
    ],
    finishes: [
      { name: "Burgundy", hex: "#672e40" },
      { name: "Glacier", hex: "#a7bfd6" },
      { name: "Silver", hex: "#d1d3d4" },
      { name: "Black", hex: "#303033" },
    ],
    configurations: ["256GB", "512GB", "1TB", "2TB"],
    releaseNote:
      "Released by Apple in September 2026. Contact LEETECH to confirm Nigerian stock, SIM compatibility and your final price.",
  },
  {
    id: "galaxy-s26-ultra",
    name: "Galaxy S26 Ultra",
    maker: "Samsung",
    category: "SMARTPHONES",
    shortName: "S26 Ultra",
    edition: "2026 GALAXY COLLECTION",
    headline: "Ultra, in every sense.",
    description:
      "A built-in Privacy Display. A 200MP wide camera. Powerful Galaxy AI, with the precision of S Pen.",
    image:
      "https://image-us.samsung.com/us/smartphones/galaxy-s26-ultra/images/galaxy-s26-ultra-features-colors-viewer-initial-cobalt-violet.jpg",
    detailImage:
      "https://image-us.samsung.com/us/smartphones/galaxy-s26-ultra/images/galaxy-s26-ultra-features-colors-viewer-initial-cobalt-violet.jpg",
    imageAlt: "Official Samsung image of the Galaxy S26 Ultra in Cobalt Violet",
    sourceUrl: "https://www.samsung.com/us/smartphones/galaxy-s26-ultra/",
    sourceLabel: "Samsung / Galaxy S26 Ultra",
    specs: [
      "6.9-inch display with built-in Privacy Display",
      "Snapdragon 8 Elite Gen 5 for Galaxy",
      "200MP wide camera with an F1.4 aperture",
      "Built-in S Pen and Galaxy AI",
    ],
    finishes: [
      { name: "Cobalt Violet", hex: "#666382" },
      { name: "Sky Blue", hex: "#b9d6e5" },
      { name: "Black", hex: "#303033" },
      { name: "White", hex: "#eeeef0" },
    ],
    configurations: ["256GB / 12GB RAM", "512GB / 12GB RAM", "1TB / 16GB RAM"],
    releaseNote:
      "Official Samsung 2026 model. Nigerian availability, regional configuration and warranty terms are confirmed on enquiry.",
  },
  {
    id: "iphone-18-pro",
    name: "iPhone 18 Pro",
    maker: "Apple",
    category: "SMARTPHONES",
    shortName: "18 Pro",
    edition: "2026 PRO COLLECTION",
    headline: "Pro power. Perfectly sized.",
    description:
      "The same A20 Pro ambition and variable-aperture camera system, in a more compact 6.3-inch design.",
    image: `${iphoneImageBase}color_glacier__fkxlpbz0ruy6_large.jpg`,
    detailImage: `${iphoneImageBase}color_glacier__fkxlpbz0ruy6_large.jpg`,
    imageAlt: "Official Apple image of the iPhone 18 Pro in Glacier",
    sourceUrl: iphoneSource,
    sourceLabel: "Apple / iPhone 18 Pro technical specifications",
    specs: [
      "6.3-inch Super Retina XDR display with ProMotion",
      "A20 Pro chip with next-generation vapor cooling",
      "48MP Pro Fusion camera system with variable aperture",
      "Aluminum unibody with Ceramic Shield front and back",
    ],
    finishes: [
      { name: "Glacier", hex: "#a7bfd6" },
      { name: "Burgundy", hex: "#672e40" },
      { name: "Silver", hex: "#d1d3d4" },
      { name: "Black", hex: "#303033" },
    ],
    configurations: ["256GB", "512GB", "1TB", "2TB"],
    releaseNote:
      "Released by Apple in September 2026. Contact LEETECH to confirm Nigerian stock, SIM compatibility and your final price.",
  },
  {
    id: "macbook-pro-m6",
    name: "MacBook Pro 14-inch M6",
    maker: "Apple",
    category: "PRO LAPTOPS",
    shortName: "MacBook Pro M6",
    edition: "JUST ANNOUNCED / OCTOBER 2026",
    headline: "Your next big idea. Unleashed.",
    description:
      "Meet the new 14-inch MacBook Pro. M6 performance, a brilliant Liquid Retina XDR display, and up to 24 hours of battery life.",
    image:
      "https://www.apple.com/newsroom/images/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/article/Apple-MacBook-Pro-14-in-with-M6-hero-261027_big.jpg.large.jpg",
    detailImage:
      "https://www.apple.com/newsroom/images/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/article/Apple-MacBook-Pro-14-in-with-M6-hero-261027_big.jpg.large.jpg",
    imageAlt: "Official Apple launch image of the 14-inch MacBook Pro with M6",
    sourceUrl:
      "https://www.apple.com/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/",
    sourceLabel: "Apple Newsroom / 14-inch MacBook Pro with M6",
    specs: [
      "M6 chip with a 12-core CPU and 12-core GPU",
      "14-inch Liquid Retina XDR display",
      "16GB unified memory standard; configurable up to 32GB",
      "Wi-Fi 7, Bluetooth 6 and up to 24 hours of battery life",
    ],
    finishes: [
      { name: "Space Black", hex: "#303033" },
      { name: "Silver", hex: "#d1d3d4" },
    ],
    configurations: [
      "16GB unified memory",
      "24GB unified memory",
      "32GB unified memory",
    ],
    releaseNote:
      "Announced October 27, 2026. Apple lists November 6, 2026 as its first availability date. Nigerian arrival dates and pricing are not yet confirmed by LEETECH.",
  },
];
