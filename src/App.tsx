import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CreditCard,
  Globe2,
  Headphones,
  Heart,
  Laptop,
  LockKeyhole,
  Menu,
  Minus,
  PackageCheck,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Trash2,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { latestDevices, type LatestDevice } from "./data/latest-devices";
import { LatestDevices, LatestDeviceDetails } from "./components/LatestDevices";
import logoFull from "./assets/logo/leetech-logo.svg?inline";
import logoCompact from "./assets/logo/leetech-logo-compact.svg?inline";
import logoLight from "./assets/logo/leetech-logo-light.svg?inline";
import "./storefront.css";

import iphone15Img from "./assets/products/iphone-15-pro-max.webp";
import iphone16Img from "./assets/products/iphone-16-pro-max.webp";
import galaxyS24Img from "./assets/products/galaxy-s24-ultra.webp";
import galaxyS25Img from "./assets/products/galaxy-s25-ultra.webp";
import macbookAirM2Img from "./assets/products/macbook-air-m2.webp";
import buds3ProImg from "./assets/products/galaxy-buds-3-pro.webp";
import apple20wImg from "./assets/products/apple-20w-usb-c-adapter.webp";
import samsung25wImg from "./assets/products/samsung-25w-usb-c-adapter.webp";
import magsafeImg from "./assets/products/magsafe-charger.webp";
import macbookAirImg from "./assets/products/macbook-air-m1.webp";
import macbookProImg from "./assets/products/macbook-pro-16-m3-max.webp";
import rogImg from "./assets/products/rog-zephyrus-g16.webp";
import sonyImg from "./assets/products/sony-wh-1000xm5.webp";
import airpodsImg from "./assets/products/airpods-pro-3-case.webp";
import gleImg from "./assets/products/mercedes-amg-gle-53.webp";
import g63Img from "./assets/products/mercedes-amg-g63.webp";
import rangeRoverImg from "./assets/products/range-rover-autobiography.webp";
import lexusImg from "./assets/products/lexus-rx-350.webp";
import audiImg from "./assets/products/audi-tt-rs-2019.webp";
import ioniq5Img from "./assets/products/hyundai-ioniq-5-2024.webp";
import bmwX5Img from "./assets/products/bmw-x5-2026.webp";
import acuraMdxImg from "./assets/products/acura-mdx-2024.webp";
import crvImg from "./assets/products/honda-cr-v-2024.webp";
import tucsonImg from "./assets/products/hyundai-tucson-2026.webp";
import bmwX3Img from "./assets/products/bmw-x3-2024.webp";
import acuraRdxImg from "./assets/products/acura-rdx-2024.webp";

type Category =
  | "all"
  | "gadgets"
  | "phones"
  | "laptops"
  | "accessories"
  | "cars"
  | "new-cars"
  | "used-cars"
  | "deals"
  | "saved";
type Product = {
  id: string;
  name: string;
  category: Category;
  label: string;
  detail: string;
  price: number;
  original?: number;
  image: string;
  badge?: string;
  rating: string;
  kind: "gadget" | "car";
  specs: string[];
};
type CartItem = {
  id: string;
  quantity: number;
  finish?: string;
  tierLabel?: string;
  unitPrice?: number;
  carePlus?: boolean;
  tradeIn?: boolean;
  swapItemName?: string;
  swapCredit?: number;
};
type Overlay =
  | "search"
  | "cart"
  | "product"
  | "latest-device"
  | "checkout"
  | "inspection"
  | "swap"
  | "info"
  | null;
type InfoKey =
  | "about"
  | "delivery"
  | "returns"
  | "warranty"
  | "support"
  | "payment"
  | "privacy"
  | "terms"
  | "faq";

/* Reviews stay hidden until they are real customer reviews. The current
   quotes, the 4.9 score and the "Verified purchase" badges are placeholders. */
const SHOW_REVIEWS = false;

const buyingSteps = [
  {
    title: "Choose & enquire",
    text: "Pick a vehicle and send an enquiry, or call or WhatsApp us about it.",
  },
  {
    title: "Inspect & verify",
    text: "We inspect the vehicle and check its papers before you commit to anything.",
  },
  {
    title: "Agree & pay",
    text: "Payment is arranged only after inspection and verification of the purchase agreement.",
  },
  {
    title: "Handover",
    text: "Collection or delivery is arranged separately once the paperwork is complete.",
  },
];

const products: Product[] = [
  {
    id: "iphone-15",
    name: "iPhone 15 Pro Max",
    category: "phones",
    label: "SMARTPHONES",
    detail: "256GB / Natural Titanium",
    price: 1850000,
    original: 2100000,
    image: iphone15Img,
    badge: "BEST SELLER",
    rating: "4.9",
    kind: "gadget",
    specs: [
      "256GB storage",
      "Natural Titanium finish",
      "Unlocked for all networks",
      "Brand new & sealed",
    ],
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "phones",
    label: "SMARTPHONES",
    detail: "256GB / Desert Titanium / A18 Pro",
    price: 2350000,
    original: 2550000,
    image: iphone16Img,
    badge: "NEW ARRIVAL",
    rating: "5.0",
    kind: "gadget",
    specs: [
      "A18 Pro chip with 6-core GPU",
      "48MP Fusion camera with Camera Control",
      "6.9-inch Super Retina XDR display",
      "Factory unlocked + 1-year Apple warranty",
    ],
  },
  {
    id: "galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    category: "phones",
    label: "SMARTPHONES",
    detail: "512GB / Titanium Gray / S-Pen",
    price: 1980000,
    original: 2200000,
    image: galaxyS24Img,
    badge: "SAVE 10%",
    rating: "4.9",
    kind: "gadget",
    specs: [
      "Snapdragon 8 Gen 3 for Galaxy",
      "200MP quad-telephoto camera system",
      "Titanium frame with built-in S-Pen",
      "Dual Nano-SIM + eSIM unlocked",
    ],
  },
  {
    id: "galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    category: "phones",
    label: "SMARTPHONES",
    detail: "256GB / Titanium Black / S-Pen",
    price: 1900000,
    image: galaxyS25Img,
    badge: "NEW ARRIVAL",
    rating: "4.9",
    kind: "gadget",
    specs: [
      "Snapdragon 8 Elite for Galaxy",
      "200MP wide camera with 5x telephoto",
      "Titanium frame with built-in S-Pen",
      "Dual Nano-SIM + eSIM unlocked",
    ],
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air 13-inch (M2)",
    category: "laptops",
    label: "LAPTOPS",
    detail: "M2 Chip / 8GB / 256GB SSD / Midnight",
    price: 1100000,
    image: macbookAirM2Img,
    badge: "NEW LISTING",
    rating: "4.9",
    kind: "gadget",
    specs: [
      "Apple M2 chip with 8-core CPU and 8-core GPU",
      "8GB unified memory & 256GB SSD storage",
      "13.6-inch Liquid Retina display",
      "Fanless design with up to 18 hours battery life",
    ],
  },
  {
    id: "galaxy-buds-3-pro",
    name: "Samsung Galaxy Buds3 Pro",
    category: "accessories",
    label: "HEADPHONES",
    detail: "Active Noise Cancelling / Silver",
    price: 245000,
    image: buds3ProImg,
    badge: "NEW ARRIVAL",
    rating: "4.8",
    kind: "gadget",
    specs: [
      "Active noise cancelling with ambient sound mode",
      "IP57 water and dust resistance",
      "Real-time interpreter with Galaxy AI",
      "Works with Android and iPhone",
    ],
  },
  {
    id: "apple-20w-usb-c-adapter",
    name: "Apple 20W USB-C Power Adapter",
    category: "accessories",
    label: "PHONE ACCESSORIES",
    detail: "20W / USB-C / White",
    price: 65000,
    image: apple20wImg,
    rating: "4.8",
    kind: "gadget",
    specs: [
      "20W USB-C fast charging for iPhone",
      "Compact single-port power adapter",
      "Use with any USB-C to Lightning or USB-C cable",
    ],
  },
  {
    id: "samsung-25w-usb-c-adapter",
    name: "Samsung 25W USB-C Adapter",
    category: "accessories",
    label: "PHONE ACCESSORIES",
    detail: "25W Super Fast Charging / Black",
    price: 55000,
    image: samsung25wImg,
    rating: "4.8",
    kind: "gadget",
    specs: [
      "25W Super Fast Charging for Galaxy devices",
      "USB Power Delivery compatible",
      "Compact single-port wall charger",
    ],
  },
  {
    id: "magsafe-charger",
    name: "MagSafe Charger (USB-C)",
    category: "accessories",
    label: "PHONE ACCESSORIES",
    detail: "1 metre / Coiled woven cable",
    price: 75000,
    image: magsafeImg,
    badge: "ACCESSORY",
    rating: "4.8",
    kind: "gadget",
    specs: [
      "MagSafe circular connector for compatible iPhones",
      "USB-C connector for the power adapter",
      "Coiled white woven cable, 1 metre",
      "Official Apple accessory",
    ],
  },
  {
    id: "macbook-air",
    name: "MacBook Air 13-inch",
    category: "laptops",
    label: "LAPTOPS",
    detail: "M1 Chip / 8GB / 256GB SSD",
    price: 1250000,
    original: 1450000,
    image: macbookAirImg,
    badge: "TOP RATED",
    rating: "5.0",
    kind: "gadget",
    specs: [
      "Apple M1 chip",
      "8GB unified memory",
      "256GB SSD storage",
      "13.3-inch Retina display",
    ],
  },
  {
    id: "macbook-pro-16",
    name: "MacBook Pro 16-inch",
    category: "laptops",
    label: "LAPTOPS",
    detail: "M3 Max / 36GB / 1TB SSD / Silver",
    price: 4650000,
    original: 4950000,
    image: macbookProImg,
    badge: "FLAGSHIP",
    rating: "5.0",
    kind: "gadget",
    specs: [
      "Apple M3 Max chip (14-core CPU / 30-core GPU)",
      "36GB unified memory & 1TB NVMe SSD",
      "16.2-inch Liquid Retina XDR ProMotion display",
      "Up to 22 hours battery life + MagSafe 3",
    ],
  },
  {
    id: "rog-zephyrus-g16",
    name: "ASUS ROG Zephyrus G16",
    category: "laptops",
    label: "LAPTOPS",
    detail: "Core Ultra 9 / RTX 4080 / 32GB / 1TB",
    price: 3200000,
    original: 3450000,
    image: rogImg,
    badge: "SAVE 7%",
    rating: "4.9",
    kind: "gadget",
    specs: [
      "Intel Core Ultra 9 185H processor",
      "NVIDIA GeForce RTX 4080 12GB GDDR6",
      "16-inch 2.5K 240Hz ROG Nebula OLED display",
      "CNC-milled aluminium chassis",
    ],
  },
  {
    id: "sony-xm5",
    name: "Sony WH-1000XM5",
    category: "accessories",
    label: "HEADPHONES",
    detail: "Wireless noise cancelling / Black",
    price: 485000,
    original: 580000,
    image: sonyImg,
    badge: "SAVE 16%",
    rating: "4.8",
    kind: "gadget",
    specs: [
      "Industry-leading noise cancellation",
      "Up to 30 hours battery life",
      "Multipoint Bluetooth connectivity",
      "Premium carrying case included",
    ],
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3 (USB-C)",
    category: "accessories",
    label: "HEADPHONES",
    detail: "MagSafe Charging Case / Active ANC",
    price: 395000,
    original: 450000,
    image: airpodsImg,
    badge: "SAVE 12%",
    rating: "4.9",
    kind: "gadget",
    specs: [
      "Apple H2 headphone chip with Adaptive Audio",
      "Active Noise Cancellation & Transparency mode",
      "Up to 8 hours listening, up to 24 hours with the case",
      "IP57 dust, sweat and water resistance",
    ],
  },
  {
    id: "premium-suv",
    name: "Mercedes-AMG GLE 53",
    category: "new-cars",
    label: "NEW VEHICLES",
    detail: "2025 / Brand new / Automatic",
    price: 185000000,
    image: gleImg,
    badge: "NEW ARRIVAL",
    rating: "5.0",
    kind: "car",
    specs: [
      "2025 model / Brand new",
      "3.0L AMG inline-six mild hybrid",
      "4MATIC all-wheel drive",
      "Full vehicle inspection available",
    ],
  },
  {
    id: "mercedes-g63-amg",
    name: "Mercedes-AMG G 63",
    category: "new-cars",
    label: "NEW VEHICLES",
    detail: "2025 / Brand new / 4.0L V8 Biturbo",
    price: 395000000,
    image: g63Img,
    badge: "FLAGSHIP SUV",
    rating: "5.0",
    kind: "car",
    specs: [
      "2025 model / Brand new 0km with full customs duty paid",
      "Handcrafted AMG 4.0L V8 Biturbo (577 hp / 850 Nm)",
      "AMG Night Package, Burmester 3D surround & massage seats",
      "Available for immediate inspection or enclosed delivery",
    ],
  },
  {
    id: "range-rover-autobiography",
    name: "Range Rover Autobiography",
    category: "new-cars",
    label: "NEW VEHICLES",
    detail: "2025 / Brand new / P530 Twin-Turbo V8",
    price: 310000000,
    image: rangeRoverImg,
    badge: "BESPOKE LUXURY",
    rating: "5.0",
    kind: "car",
    specs: [
      "2025 Autobiography P530 / Brand new",
      "4.4L Twin-Turbo V8 (523 hp) with All-Wheel Steering",
      "Semi-Aniline perforated leather & Executive Class rear seating",
      "Meridian Signature Sound System & electronic air suspension",
    ],
  },
  {
    id: "lexus-rx350-fsport",
    name: "Lexus RX 350 F-Sport",
    category: "used-cars",
    label: "VERIFIED VEHICLES",
    detail: "2022 / Foreign used / Automatic / AWD",
    price: 46000000,
    image: lexusImg,
    badge: "TOKUNBO VERIFIED",
    rating: "4.9",
    kind: "car",
    specs: [
      "2022 model / Foreign used (accident-free Carfax verified)",
      "3.5L V6 engine with 8-speed paddle-shift automatic",
      "Circuit Red F-Sport leather interior & panoramic roof",
      "Full Lagos & Abuja customs duty paid with original papers",
    ],
  },
  {
    id: "audi-tt-rs-2019",
    name: "Audi TT RS",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2019 / Used / 31,574 miles / RS",
    price: 87322000,
    image: audiImg,
    rating: "4.8",
    kind: "car",
    specs: [
      "2019 model / Used, 31,574 miles",
      "2.5L TFSI turbo, 400 hp (RS spec)",
      "Quattro all-wheel drive",
      "Full inspection and papers check before handover",
    ],
  },
  {
    id: "hyundai-ioniq-5-2024",
    name: "Hyundai Ioniq 5 SEL",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2024 / Used / Battery electric / 31,928 miles",
    price: 32158000,
    image: ioniq5Img,
    rating: "4.8",
    kind: "car",
    specs: [
      "2024 model / Used, 31,928 miles",
      "Battery electric (SEL trim)",
      "Full inspection and papers check before handover",
      "Ready for Lagos & Abuja delivery",
    ],
  },
  {
    id: "bmw-x5-2026",
    name: "BMW X5 xDrive40i",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2026 / Used / 1,252 miles / xDrive40i",
    price: 94026000,
    image: bmwX5Img,
    rating: "4.9",
    kind: "car",
    specs: [
      "2026 model / Used, 1,252 miles",
      "xDrive40i all-wheel drive",
      "Full inspection and papers check before handover",
      "Ready for Lagos & Abuja delivery",
    ],
  },
  {
    id: "acura-mdx-2024",
    name: "Acura MDX Base",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2024 / Certified Pre-Owned / 27,792 miles",
    price: 49686000,
    badge: "CERTIFIED PRE-OWNED",
    image: acuraMdxImg,
    rating: "4.8",
    kind: "car",
    specs: [
      "2024 model / Certified Pre-Owned, 27,792 miles",
      "Base trim with SH-AWD",
      "Full inspection and papers check before handover",
      "Ready for Lagos & Abuja delivery",
    ],
  },
  {
    id: "honda-cr-v-2024",
    name: "Honda CR-V EX",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2024 / Used / 46,970 miles / EX",
    price: 38187000,
    badge: "PRICE DROP",
    image: crvImg,
    rating: "4.7",
    kind: "car",
    specs: [
      "2024 model / Used, 46,970 miles",
      "EX trim",
      "Full inspection and papers check before handover",
      "Ready for Lagos & Abuja delivery",
    ],
  },
  {
    id: "hyundai-tucson-2026",
    name: "Hyundai Tucson SEL",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2026 / Used / 3,215 miles / SEL",
    price: 39945000,
    image: tucsonImg,
    rating: "4.8",
    kind: "car",
    specs: [
      "2026 model / Used, 3,215 miles",
      "SEL trim",
      "Full inspection and papers check before handover",
      "Ready for Lagos & Abuja delivery",
    ],
  },
  {
    id: "bmw-x3-2024",
    name: "BMW X3 sDrive30i",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2024 / Used / 44,980 miles / sDrive30i",
    price: 39892000,
    image: bmwX3Img,
    rating: "4.8",
    kind: "car",
    specs: [
      "2024 model / Used, 44,980 miles",
      "sDrive30i rear-wheel drive",
      "Full inspection and papers check before handover",
      "Ready for Lagos & Abuja delivery",
    ],
  },
  {
    id: "acura-rdx-2024",
    name: "Acura RDX A-Spec",
    category: "used-cars",
    label: "USED VEHICLES",
    detail: "2024 / Certified Pre-Owned / 54,729 miles / A-Spec",
    price: 47000000,
    badge: "CERTIFIED PRE-OWNED",
    image: acuraRdxImg,
    rating: "4.8",
    kind: "car",
    specs: [
      "2024 model / Certified Pre-Owned, 54,729 miles",
      "A-Spec trim",
      "Full inspection and papers check before handover",
      "Ready for Lagos & Abuja delivery",
    ],
  },
];

const swapCatalog = {
  gadget: [
    {
      id: "trade-ip15pm",
      name: "iPhone 15 Pro Max (256GB–1TB)",
      baseValue: 1350000,
    },
    {
      id: "trade-ip14pm",
      name: "iPhone 14 Pro Max (128GB–512GB)",
      baseValue: 980000,
    },
    { id: "trade-ip13pm", name: "iPhone 13 Pro / Pro Max", baseValue: 680000 },
    {
      id: "trade-s24u",
      name: "Samsung Galaxy S24 Ultra 5G",
      baseValue: 1320000,
    },
    {
      id: "trade-s23u",
      name: "Samsung Galaxy S23 Ultra 5G",
      baseValue: 890000,
    },
    {
      id: "trade-mbp",
      name: 'MacBook Pro 14" / 16" (M1–M3)',
      baseValue: 1950000,
    },
    { id: "trade-mba", name: 'MacBook Air 13" (M1 / M2)', baseValue: 820000 },
  ],
  car: [
    {
      id: "trade-c300",
      name: "Mercedes-Benz C300 (2018–2021)",
      baseValue: 29500000,
    },
    {
      id: "trade-e350",
      name: "Mercedes-Benz E350 4MATIC (2019–2021)",
      baseValue: 38000000,
    },
    {
      id: "trade-gle",
      name: "Mercedes-Benz GLE 450 / GLE 53",
      baseValue: 115000000,
    },
    {
      id: "trade-rx350",
      name: "Lexus RX 350 / F-Sport (2018–2022)",
      baseValue: 34000000,
    },
    {
      id: "trade-lc",
      name: "Toyota Land Cruiser / Prado",
      baseValue: 88000000,
    },
    {
      id: "trade-rr",
      name: "Range Rover Autobiography / Sport",
      baseValue: 120000000,
    },
  ],
} as const;

const swapConditions = [
  {
    id: "mint",
    label: "Pristine / Mint",
    factor: 1,
    note: "Flawless condition, original parts & papers",
  },
  {
    id: "good",
    label: "Good / Clean Used",
    factor: 0.85,
    note: "Light everyday wear, 100% functional",
  },
  {
    id: "fair",
    label: "Fair / Minor Service",
    factor: 0.7,
    note: "Cosmetic wear or minor maintenance needed",
  },
] as const;

const categories = [
  { id: "phones", label: "Phones", icon: Smartphone },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "accessories", label: "Accessories", icon: Headphones },
  { id: "cars", label: "Cars", icon: CarFront },
  { id: "new-cars", label: "New cars", icon: CarFront },
  { id: "used-cars", label: "Used cars", icon: CarFront },
] as const;

const categoryNames: Record<Category, string> = {
  all: "All products",
  gadgets: "Gadgets",
  phones: "Phones",
  laptops: "Laptops",
  accessories: "Accessories",
  cars: "Cars",
  "new-cars": "New cars",
  "used-cars": "Used cars",
  deals: "The weekly drop",
  saved: "Your wishlist",
};

const benefits = [
  {
    icon: Truck,
    title: "Nationwide delivery",
    text: "From our store to your door. All 36 states.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Your payments and details, protected.",
  },
  {
    icon: PackageCheck,
    title: "Warranty assured",
    text: "Real products. Real peace of mind.",
  },
  {
    icon: Headphones,
    title: "Expert support",
    text: "Real people who know their tech and cars.",
  },
  {
    icon: BadgeCheck,
    title: "Verified quality",
    text: "Every device. Every vehicle. Checked.",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    text: "More ways to make your next move.",
  },
];

const reviews = [
  {
    name: "Chinedu O.",
    initials: "CO",
    city: "Lagos",
    product: "iPhone 15 Pro Max",
    quote:
      "My iPhone arrived sealed and exactly as described. Smooth ordering, fast delivery, no stories. This is how online shopping should be.",
  },
  {
    name: "Amina B.",
    initials: "AB",
    city: "Abuja",
    product: "Mercedes-Benz C300",
    quote:
      "From inspection to the paperwork, the entire process was transparent. I got a car I love and complete peace of mind.",
  },
  {
    name: "Tobi A.",
    initials: "TA",
    city: "Ibadan",
    product: "MacBook Pro",
    quote:
      "Premium really means premium here. My MacBook came perfectly packaged, and the team helped me pick the right specs. Highly recommend.",
  },
];

const infoContent: Record<
  InfoKey,
  { title: string; intro: string; details: string[] }
> = {
  about: {
    title: "One brand. More possibilities.",
    intro:
      "LEETECH & AUTOS brings premium technology and quality vehicles together in one trusted Nigerian destination.",
    details: [
      "We curate phones, laptops, headphones and phone accessories for the way you live and work.",
      "Our auto collection brings together quality new and used vehicles.",
      "Our standard is simple: considered products, transparent information and support from real people.",
    ],
  },
  delivery: {
    title: "Your upgrade. Delivered.",
    intro: "We make it easier to shop from anywhere in Nigeria.",
    details: [
      "Gadget delivery is available nationwide, subject to your delivery address and product availability.",
      "Delivery fees and expected arrival dates are confirmed before an order is accepted.",
      "Vehicle collection and delivery are arranged separately after inspection and documentation.",
    ],
  },
  returns: {
    title: "Shop with confidence.",
    intro: "If something is not right, our support team is here to help.",
    details: [
      "Keep the product, original packaging, accessories and order confirmation.",
      "Contact support before sending an item back. Return eligibility depends on the product, condition and reason for return.",
      "Vehicle transactions follow the inspection and purchase agreement confirmed before payment.",
    ],
  },
  warranty: {
    title: "Quality that stands behind you.",
    intro:
      "Warranty eligibility and coverage are confirmed for each product before purchase.",
    details: [
      "Brand-new devices include the applicable manufacturer or seller warranty stated on the listing.",
      "Accidental damage, misuse and unauthorised repairs may not be covered.",
      "Keep your proof of purchase and contact support for help with a warranty claim.",
    ],
  },
  support: {
    title: "Real people. Expert advice.",
    intro:
      "Need help choosing a device, finding the right device or understanding a vehicle? Reach our team directly by phone or on TikTok.",
    details: [
      "Direct phone line: 09138130976 — speak with our gadget & auto specialists for enquiries, swaps, or inspections.",
      "Official TikTok: @leetech.autos (tiktok.com/@leetech.autos) — watch live unboxings, vehicle walkarounds, and daily drops.",
      "For a vehicle, select Book an inspection to prepare a personalised inspection request.",
    ],
  },
  payment: {
    title: "Your next move. Your way.",
    intro: "Explore payment options that fit your purchase.",
    details: [
      "Payment options are confirmed at checkout and may vary by item and order value.",
      "Vehicle payments are only arranged after inspection and verification of the purchase agreement.",
      "This preview never collects card details or processes payments. The checkout creates a local demo order only.",
    ],
  },
  privacy: {
    title: "Your privacy matters.",
    intro: "This demo keeps your shopping experience on your device.",
    details: [
      "Cart items, saved products and newsletter preferences are stored in your browser.",
      "No card data is collected. Demo order and inspection details are not transmitted to a server.",
      "You can clear saved information at any time by clearing this site's browser storage.",
    ],
  },
  terms: {
    title: "A clear way to shop.",
    intro: "This is an interactive storefront preview for LEETECH & AUTOS.",
    details: [
      "Products, prices, reviews and availability are illustrative and must be confirmed before a real purchase.",
      "Product imagery is for presentation; exact specifications and condition must be confirmed with the seller.",
      "Submitting a demo checkout or inspection form does not create a binding purchase or confirmed appointment.",
    ],
  },
  faq: {
    title: "Good questions. Clear answers.",
    intro: "A little clarity before your next upgrade.",
    details: [
      "Are your products original? Our collection is built around verified devices and quality vehicles. Exact product condition is shown on each listing.",
      "Can I inspect a vehicle? Yes. Open a vehicle listing and choose Book an inspection to prepare your preferred date and time.",
      "Do you deliver outside Lagos? Nationwide gadget delivery is planned for all 36 states and the FCT, with fees confirmed before purchase.",
      "Can I pay in instalments? Flexible payment availability depends on the product and eligibility. Check the available options before confirming an order.",
    ],
  },
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

function Instagram({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.7" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Facebook({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.7 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.5v3.2h2.8V21h3.4Z" />
    </svg>
  );
}

function TikTok({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z" />
    </svg>
  );
}

/** Renders a bundled SVG logo to a 2400px PNG. The canvas starts transparent, so the PNG has no background. */
async function downloadLogoPng(source: string, filename: string) {
  const image = new Image();
  image.src = source;
  await image.decode();
  const width = 2400;
  const height = Math.round((width * image.naturalHeight) / image.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((done) =>
    canvas.toBlob(done, "image/png"),
  );
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function getProductConfig(product: Product) {
  if (product.kind === "car") {
    return {
      step1Label: "EXTERIOR FINISH",
      finishes: [
        { name: "Obsidian Black", hex: "#1b1c1e" },
        { name: "Polar White", hex: "#efeee9" },
        { name: "Selenite Grey", hex: "#6d7075" },
        { name: "Emerald Green", hex: "#203b31" },
      ],
      step2Label: "PURCHASE & RESERVATION OPTION",
      tiers: [
        {
          label: "Outright Vehicle Purchase",
          delta: 0,
          note: "Full customs papers & immediate allocation",
        },
        {
          label: "10% Refundable Reservation Deposit",
          delta: -Math.round(product.price * 0.9),
          note: "Holds vehicle 7 days pending physical inspection",
        },
        {
          label: "Outright + Enclosed Flatbed Delivery",
          delta: 650000,
          note: "Insured door-to-door transport to any state",
        },
      ],
      careTitle: "1-Year Drivetrain Warranty + Satellite GPS Tracker",
      carePrice: 450000,
      tradeInTitle: "Request Vehicle Trade-In / Swap Valuation",
    };
  }
  if (product.category === "phones") {
    return {
      step1Label: "FINISH",
      finishes: [
        { name: "Natural Titanium", hex: "#c3beb4" },
        { name: "Desert Titanium", hex: "#bfa48f" },
        { name: "Black Titanium", hex: "#2f3033" },
        { name: "White Titanium", hex: "#f1efe9" },
      ],
      step2Label: "STORAGE CAPACITY",
      tiers: [
        { label: "Base Storage", delta: 0, note: "Standard factory capacity" },
        {
          label: "512GB Storage",
          delta: 280000,
          note: "2x space for ProRes 4K",
        },
        {
          label: "1TB Pro Storage",
          delta: 580000,
          note: "Maximum studio capacity",
        },
      ],
      careTitle: "AppleCare+ / LEETECH 2-Year Screen & Theft Cover",
      carePrice: 145000,
      tradeInTitle: "Apply Apple / Samsung Trade-In Credit on Delivery",
    };
  }
  if (product.category === "laptops") {
    return {
      step1Label: "ENCLOSURE FINISH",
      finishes: [
        { name: "Space Black", hex: "#2c2d30" },
        { name: "Silver", hex: "#d6d8db" },
        { name: "Starlight", hex: "#e4ddd2" },
      ],
      step2Label: "MEMORY & STORAGE SPEC",
      tiers: [
        {
          label: "Standard Configuration",
          delta: 0,
          note: "Factory sealed configuration",
        },
        {
          label: "Expanded Storage (+512GB)",
          delta: 310000,
          note: "Double NVMe SSD storage",
        },
        {
          label: "Creator Bundle (+Pro Accessories)",
          delta: 460000,
          note: "Includes hub / stylus & sleeve",
        },
      ],
      careTitle: "AppleCare+ / 2-Year LEETECH Pro Hardware Warranty",
      carePrice: 185000,
      tradeInTitle: "Trade In an Eligible MacBook or iPad",
    };
  }
  return {
    step1Label: "EDITION FINISH",
    finishes: [
      { name: "Obsidian Black", hex: "#242528" },
      { name: "Platinum Silver", hex: "#dcdad3" },
    ],
    step2Label: "PACKAGE",
    tiers: [
      {
        label: "Standard Retail Box",
        delta: 0,
        note: "Complete factory accessories",
      },
      {
        label: "VIP Bundle + Surge Protection",
        delta: 65000,
        note: "Includes premium travel/power kit",
      },
    ],
    careTitle: "2-Year LEETECH Instant Replacement Plan",
    carePrice: 40000,
    tradeInTitle: "Request Old Device Trade-In Credit",
  };
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function store(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Shopping remains available when browser storage is disabled. */
  }
}

/* Hero copy rises in one line at a time. Reduced-motion visitors see it at once. */
function useHeroRise() {
  const reduced = useReducedMotion();
  return (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.75,
      delay: 0.25 + i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Stars({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`stars ${small ? "stars-small" : ""}`}
      aria-label="5 out of 5 stars"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

function Dialog({
  title,
  onClose,
  children,
  wide = false,
  drawer = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const isPresent = useIsPresent();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!isPresent) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = ref.current;
    const timer = window.setTimeout(() => {
      const input = panel?.querySelector<HTMLElement>("[data-autofocus]");
      (input || panel)?.focus();
    }, 80);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]',
        ),
      ).filter((el) => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === panel)
      ) {
        event.preventDefault();
        last?.focus();
      }
      if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === panel)
      ) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      previous?.focus({ preventScroll: true });
    };
  }, [onClose, isPresent]);
  return (
    <motion.div
      className={`dialog-backdrop ${drawer ? "drawer-backdrop" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden={!isPresent}
      transition={{ duration: reduced ? 0 : 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={ref}
        className={`dialog ${wide ? "dialog-wide" : ""} ${drawer ? "cart-drawer" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={drawer ? { x: 70 } : { y: 24, scale: 0.98 }}
        animate={{ x: 0, y: 0, scale: 1 }}
        exit={drawer ? { x: 70 } : { y: 16, scale: 0.98 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
      >
        <div className="dialog-header">
          <h2 id={titleId}>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [category, setCategory] = useState<Category>("all");
  const [expanded, setExpanded] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [selectedLatestDevice, setSelectedLatestDevice] =
    useState<LatestDevice>(latestDevices[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [navDropdown, setNavDropdown] = useState<"gadgets" | "cars" | null>(
    null,
  );
  const [mobileMenu, setMobileMenu] = useState(false);
  const [infoKey, setInfoKey] = useState<InfoKey>("about");
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [selectedTier, setSelectedTier] = useState(0);
  const [carePlus, setCarePlus] = useState(false);
  const [tradeIn, setTradeIn] = useState(false);
  const [lastOrderSummary, setLastOrderSummary] = useState<{
    reference: string;
    total: number;
    paymentMethod: string;
    items: { name: string; quantity: number; config?: string; price: number }[];
  } | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = readStorage<CartItem[]>("leetech-cart", []);
    return Array.isArray(saved)
      ? saved
          .filter(
            (i) =>
              i &&
              products.some((p) => p.id === i.id) &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0,
          )
          .map((i) => ({ ...i, quantity: Math.min(i.quantity, 99) }))
      : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = readStorage<string[]>("leetech-wishlist", []);
    return Array.isArray(saved)
      ? saved.filter((id) => products.some((p) => p.id === id))
      : [];
  });
  const [toast, setToast] = useState<{
    message: string;
    cart?: boolean;
  } | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState(() => {
    const saved = readStorage<string>("leetech-newsletter", "");
    return typeof saved === "string" ? saved : "";
  });
  const [orderComplete, setOrderComplete] = useState("");
  const [inspectionComplete, setInspectionComplete] = useState(false);
  const [swapMode, setSwapMode] = useState<"swap" | "sell">("swap");
  const [swapKind, setSwapKind] = useState<"gadget" | "car">("gadget");
  const [swapItemId, setSwapItemId] = useState<string>(
    swapCatalog.gadget[0].id,
  );
  const [swapCondition, setSwapCondition] = useState<"mint" | "good" | "fair">(
    "mint",
  );
  const [swapTargetId, setSwapTargetId] = useState<string>("iphone-16-pro-max");
  const [swapReference, setSwapReference] = useState("");
  const [now, setNow] = useState(Date.now());
  const [dealDeadline] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + (7 - end.getDay()));
    end.setHours(23, 59, 59, 999);
    return end.getTime();
  });
  const reduced = useReducedMotion();
  const rise = useHeroRise();
  const closeDialog = useRef(() => setOverlay(null)).current;

  useEffect(() => {
    store("leetech-cart", cart);
  }, [cart]);
  useEffect(() => {
    store("leetech-wishlist", wishlist);
  }, [wishlist]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    document.body.style.overflow = overlay || mobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay, mobileMenu]);
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenu(false);
        setNavDropdown(null);
      }
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (event.target as HTMLElement).tagName,
        )
      ) {
        event.preventDefault();
        setOverlay("search");
        setMobileMenu(false);
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      (item.unitPrice ?? products.find((p) => p.id === item.id)?.price ?? 0) *
        item.quantity,
    0,
  );
  const remaining = Math.max(0, dealDeadline - now);
  const countdown = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ];
  const filteredProducts = products.filter((p) => {
    if (category === "all") return true;
    if (category === "gadgets")
      return p.kind === "gadget";
    if (category === "cars") return p.kind === "car";
    if (category === "deals") return Boolean(p.original);
    if (category === "saved") return wishlist.includes(p.id);
    return p.category === category;
  });
  const displayedProducts =
    category === "all" && !expanded
      ? filteredProducts.slice(0, 4)
      : filteredProducts;
  const searchResults = products.filter((p) =>
    `${p.name} ${p.label} ${p.detail} ${p.category}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );
  const latestSearchResults = searchQuery.trim()
    ? latestDevices.filter((device) =>
        `${device.name} ${device.maker} ${device.category}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
    : [];

  function browse(next: Category, showAll = true) {
    setCategory(next);
    setExpanded(showAll);
    setMobileMenu(false);
    setNavDropdown(null);
    setOverlay(null);
    window.setTimeout(
      () =>
        document.getElementById("bestsellers")?.scrollIntoView({
          behavior: reduced ? "instant" : "smooth",
          block: "start",
        }),
      40,
    );
  }
  function openProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedFinish(0);
    setSelectedTier(0);
    setCarePlus(false);
    setTradeIn(false);
    setOverlay("product");
  }
  function showLatestDevices() {
    setMobileMenu(false);
    setNavDropdown(null);
    setOverlay(null);
    window.setTimeout(
      () =>
        document
          .getElementById("latest-devices")
          ?.scrollIntoView({
            behavior: reduced ? "instant" : "smooth",
            block: "start",
          }),
      40,
    );
  }
  function openLatestDevice(device: LatestDevice) {
    setSelectedLatestDevice(device);
    setOverlay("latest-device");
    setMobileMenu(false);
    setNavDropdown(null);
  }
  function openInfo(key: InfoKey) {
    setInfoKey(key);
    setOverlay("info");
    setMobileMenu(false);
  }
  function toggleWishlist(id: string) {
    const exists = wishlist.includes(id);
    setWishlist((items) =>
      exists ? items.filter((item) => item !== id) : [...items, id],
    );
    setToast({
      message: exists ? "Removed from your wishlist" : "Saved to your wishlist",
    });
  }
  function openSwapDesk(
    mode: "swap" | "sell" = "swap",
    kind: "gadget" | "car" = "gadget",
    targetProductId?: string,
  ) {
    setSwapMode(mode);
    setSwapKind(kind);
    setSwapItemId(swapCatalog[kind][0].id);
    setSwapCondition("mint");
    if (targetProductId) {
      setSwapTargetId(targetProductId);
    } else {
      const defaultTarget = products.find((p) => p.kind === kind);
      if (defaultTarget) setSwapTargetId(defaultTarget.id);
    }
    setSwapReference("");
    setMobileMenu(false);
    setOverlay("swap");
  }
  function addToCart(
    product: Product,
    custom?: {
      finish?: string;
      tierLabel?: string;
      unitPrice?: number;
      carePlus?: boolean;
      tradeIn?: boolean;
      swapItemName?: string;
      swapCredit?: number;
    },
  ) {
    setCart((items) => {
      const exists = items.find((i) => i.id === product.id);
      return exists
        ? items.map((i) =>
            i.id === product.id
              ? {
                  ...i,
                  ...(custom || {}),
                  quantity: Math.min(99, i.quantity + 1),
                }
              : i,
          )
        : [...items, { id: product.id, quantity: 1, ...(custom || {}) }];
    });
    setToast({ message: `${product.name} added to your bag`, cart: true });
  }
  function changeQuantity(id: string, amount: number) {
    setCart((items) =>
      items
        .map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(99, i.quantity + amount) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }
  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email")).trim();
    store("leetech-newsletter", email);
    setSubscribedEmail(email);
  }
  function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const reference = `LT-${Date.now().toString().slice(-7)}`;
    const summaryItems = cart.map((item) => {
      const product = products.find((p) => p.id === item.id)!;
      const parts = [
        item.finish,
        item.tierLabel,
        item.carePlus ? "LEETECH Care+" : undefined,
        item.tradeIn ? "Trade-In Requested" : undefined,
        item.swapItemName
          ? `Swapped: ${item.swapItemName} (-${currency(item.swapCredit || 0)})`
          : undefined,
      ].filter(Boolean);
      return {
        name: product.name,
        quantity: item.quantity,
        config: parts.length ? parts.join(" · ") : product.detail,
        price: (item.unitPrice ?? product.price) * item.quantity,
      };
    });
    const orderPayload = {
      reference,
      contact: data,
      items: cart,
      summaryItems,
      total: cartTotal,
      paymentMethod: String(
        data.paymentMethod || "Instant Transfer / Paystack Invoice",
      ),
      createdAt: new Date().toISOString(),
      demo: true,
    };
    store("leetech-last-order", orderPayload);
    setLastOrderSummary({
      reference,
      total: cartTotal,
      paymentMethod: orderPayload.paymentMethod,
      items: summaryItems,
    });
    setOrderComplete(reference);
    setCart([]);
  }
  function bookInspection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    store("leetech-inspection", {
      ...Object.fromEntries(new FormData(event.currentTarget)),
      vehicle: selectedProduct.name,
      demo: true,
    });
    setInspectionComplete(true);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>YOUR NEXT UPGRADE STARTS HERE.</span>
          <span className="utility-contacts">
            <a
              href="tel:09138130976"
              className="utility-contact-link"
              aria-label="Call LEETECH & AUTOS at 09138130976"
            >
              <Phone size={11} />
              <span>09138130976</span>
            </a>
            <span className="utility-divider">/</span>
            <a
              href="https://www.tiktok.com/@leetech.autos"
              target="_blank"
              rel="noreferrer"
              className="utility-contact-link"
              aria-label="TikTok leetech.autos"
            >
              <TikTok size={11} />
              <span>leetech.autos</span>
            </a>
          </span>
          <span>
            <Globe2 size={12} /> Nigeria{" "}
            <span className="utility-divider">/</span> NGN{" "}
            <ChevronDown size={11} />
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a
            className="brand"
            href="#"
            aria-label="LEETECH and AUTOS home"
            onClick={() => {
              setCategory("all");
              setExpanded(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={logoCompact}
              alt="LEETECH & AUTOS"
              width="148"
              height="58"
            />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <div
              className="nav-dropdown-wrap"
              onMouseEnter={() => setNavDropdown("gadgets")}
              onMouseLeave={() => setNavDropdown(null)}
            >
              <button
                className="nav-link"
                aria-expanded={navDropdown === "gadgets"}
                onClick={() =>
                  setNavDropdown(navDropdown === "gadgets" ? null : "gadgets")
                }
              >
                Shop gadgets <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {navDropdown === "gadgets" && (
                  <motion.div
                    className="nav-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <span className="dropdown-label">
                      UPGRADE YOUR EVERYDAY
                    </span>
                    {(
                      [
                        "phones",
                        "laptops",
                        "accessories",
                      ] as Category[]
                    ).map((id) => (
                      <button key={id} onClick={() => browse(id)}>
                        {categoryNames[id]}
                        <ChevronRight size={14} />
                      </button>
                    ))}
                    <button
                      className="dropdown-all"
                      onClick={() => browse("gadgets")}
                    >
                      Shop all gadgets <ArrowUpRight size={15} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div
              className="nav-dropdown-wrap"
              onMouseEnter={() => setNavDropdown("cars")}
              onMouseLeave={() => setNavDropdown(null)}
            >
              <button
                className="nav-link"
                aria-expanded={navDropdown === "cars"}
                onClick={() =>
                  setNavDropdown(navDropdown === "cars" ? null : "cars")
                }
              >
                Cars & auto <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {navDropdown === "cars" && (
                  <motion.div
                    className="nav-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <span className="dropdown-label">FIND YOUR NEXT DRIVE</span>
                    {(
                      [
                        "cars",
                        "new-cars",
                        "used-cars",
                      ] as Category[]
                    ).map((id) => (
                      <button key={id} onClick={() => browse(id)}>
                        {categoryNames[id]}
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              className="nav-link latest-nav-link"
              onClick={showLatestDevices}
            >
              Latest devices
            </button>
            <button
              className="nav-link"
              onClick={() => openSwapDesk("swap", "gadget")}
            >
              Swap &amp; sell
            </button>
            <button
              className="nav-link deals-nav"
              onClick={() =>
                document
                  .getElementById("weekly-deals")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span /> Hot deals
            </button>
            <button className="nav-link" onClick={() => openInfo("about")}>
              About us
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="header-search"
              onClick={() => setOverlay("search")}
              aria-label="Search products"
            >
              <Search size={17} />
              <span>Find your next upgrade</span>
              <kbd>/</kbd>
            </button>
            <button
              className={`icon-button wishlist-button ${wishlist.length ? "has-items" : ""}`}
              onClick={() => browse("saved")}
              aria-label={`Wishlist, ${wishlist.length} saved products`}
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="small-count">{wishlist.length}</span>
              )}
            </button>
            <span className="header-separator" />
            <button
              className="icon-button cart-button"
              onClick={() => setOverlay("cart")}
              aria-label={`Open shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={21} />
              <span className="cart-count">{cartCount}</span>
            </button>
            <button
              className="icon-button mobile-menu-button"
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="mobile-nav-title">MAKE YOUR NEXT MOVE.</div>
            <button onClick={showLatestDevices}>
              Latest devices <ArrowUpRight size={20} />
            </button>
            {(
              [
                "gadgets",
                "cars",
                "accessories",
                "deals",
                "saved",
              ] as Category[]
            ).map((id) => (
              <button key={id} onClick={() => browse(id)}>
                {categoryNames[id]}
                <ArrowUpRight size={20} />
              </button>
            ))}
            <button onClick={() => openSwapDesk("swap", "gadget")}>
              Swap or sell your gadget / car
              <ArrowUpRight size={20} />
            </button>
            <div className="mobile-nav-bottom">
              <a href="tel:09138130976" className="mobile-contact-link">
                <Phone size={15} /> 09138130976
              </a>
              <a
                href="https://www.tiktok.com/@leetech.autos"
                target="_blank"
                rel="noreferrer"
                className="mobile-contact-link"
              >
                <TikTok size={15} /> leetech.autos
              </a>
              <button onClick={() => openInfo("about")}>About LEETECH</button>
              <button onClick={() => openInfo("support")}>Get support</button>
              <span>GADGETS. CARS. POWER.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <motion.img
            className="hero-image hero-cutout"
            src={rangeRoverImg}
            alt="Official Land Rover image of the Range Rover Autobiography, background removed"
            width={2400}
            height={1254}
            fetchPriority="high"
            initial={reduced ? false : { scale: 1.065, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="hero-shade" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <motion.div className="eyebrow hero-eyebrow" {...rise(0)}>
                <span /> EXCEPTIONAL BY DESIGN. EXTRAORDINARY BY CHOICE.
              </motion.div>
              <motion.h1 id="hero-title" {...rise(1)}>
                LEETECH
                <br />
                <span className="hero-brand-classic">
                  &amp; AUTOS<span className="red-dot">.</span>
                </span>
              </motion.h1>
              <motion.h2 className="hero-tagline" {...rise(2)}>
                GADGETS. CARS. POWER.
              </motion.h2>
              <motion.p {...rise(3)}>
                Exceptional technology. Remarkable drives.
                <br />A considered collection for a life well lived.
              </motion.p>
              <motion.div className="hero-ctas" {...rise(4)}>
                <button
                  className="button button-red"
                  onClick={() => browse("gadgets")}
                >
                  Shop gadgets <ArrowUpRight size={18} />
                </button>
                <button
                  className="button button-outline"
                  onClick={() => browse("cars")}
                >
                  View car deals <ArrowUpRight size={18} />
                </button>
              </motion.div>
            </div>
          </div>
          <div className="hero-bottom-line" />
        </section>
        <div className="hero-trust">
          <div className="container hero-trust-inner">
            {[
              {
                icon: Truck,
                text: "Free delivery",
                detail: "on eligible orders",
              },
              {
                icon: BadgeCheck,
                text: "Verified quality",
                detail: "no compromises",
              },
              {
                icon: ShieldCheck,
                text: "Secure checkout",
                detail: "shop with confidence",
              },
              {
                icon: CreditCard,
                text: "Flexible payment",
                detail: "your upgrade, your way",
              },
            ].map(({ icon: Icon, text, detail }) => (
              <div key={text}>
                <Icon size={20} strokeWidth={1.5} />
                <span>
                  {text}
                  <small>{detail}</small>
                </span>
              </div>
            ))}
          </div>
        </div>

        <LatestDevices
          onExplore={openLatestDevice}
          onBrowse={() => browse("gadgets")}
        />

        <section
          className="categories-section section container"
          aria-labelledby="categories-title"
        >
          <Reveal>
            <div className="section-heading category-heading">
              <div>
                <span className="eyebrow">01 / A WORLD OF POSSIBILITIES</span>
                <h2 id="categories-title">
                  Your world. <em>Beautifully upgraded.</em>
                </h2>
              </div>
              <button className="text-link" onClick={() => browse("all")}>
                Explore all categories <ArrowUpRight size={16} />
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="category-grid">
              {categories.map(({ id, label, icon: Icon }) => (
                <button
                  className={`category-button ${category === id ? "active" : ""}`}
                  key={id}
                  onClick={() => browse(id)}
                >
                  <Icon size={28} strokeWidth={1.35} />
                  <span>{label}</span>
                  <ArrowUpRight className="category-arrow" size={12} />
                </button>
              ))}
            </div>
          </Reveal>
        </section>

        <section
          id="bestsellers"
          className="bestsellers-section section container"
          aria-labelledby="bestsellers-title"
        >
          <Reveal>
            <div className="section-heading products-heading">
              <div>
                <span className="eyebrow">02 / THE CONSIDERED COLLECTION</span>
                <h2 id="bestsellers-title">
                  {category === "all" ? (
                    expanded ? (
                      "THE UPGRADE COLLECTION"
                    ) : (
                      <>
                        The most <em>wanted.</em>
                      </>
                    )
                  ) : (
                    categoryNames[category].toUpperCase()
                  )}
                  {(category !== "all" || expanded) && (
                    <span className="accent">.</span>
                  )}
                </h2>
                <p>
                  {category === "saved"
                    ? "Good taste. Saved for later."
                    : "Our best sellers. Selected for the way you live and move."}
                </p>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  if (expanded && category === "all") setExpanded(false);
                  else {
                    setCategory("all");
                    setExpanded(true);
                  }
                }}
              >
                {expanded && category === "all"
                  ? "Show best sellers"
                  : "View all products"}{" "}
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="product-filters" aria-label="Filter products">
              {(["all", "gadgets", "cars", "deals"] as Category[]).map((id) => (
                <button
                  className={category === id ? "active" : ""}
                  key={id}
                  onClick={() => {
                    setCategory(id);
                    setExpanded(id !== "all");
                  }}
                >
                  {id === "all"
                    ? "All products"
                    : id === "deals"
                      ? "On sale"
                      : categoryNames[id]}
                  {id === "deals" && <span className="filter-dot" />}
                </button>
              ))}
              {!["all", "gadgets", "cars", "deals"].includes(category) && (
                <button
                  className="active filter-selected"
                  onClick={() => {
                    setCategory("all");
                    setExpanded(false);
                  }}
                >
                  {categoryNames[category]}
                  <X size={12} />
                </button>
              )}
            </div>
          </Reveal>
          <div className="product-grid">
            {displayedProducts.map((product, index) => (
              <Reveal
                key={product.id}
                delay={Math.min((index % 4) * 0.06, 0.18)}
              >
                <article className="product-card" data-product-id={product.id}>
                  <div className="product-media">
                    {product.badge && (
                      <button
                        className={`product-badge ${product.badge.includes("SAVE") ? "badge-sale" : ""}`}
                        onClick={() => openProduct(product)}
                      >
                        {product.badge}
                      </button>
                    )}
                    <button
                      className={`product-heart ${wishlist.includes(product.id) ? "is-saved" : ""}`}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={`${wishlist.includes(product.id) ? "Remove" : "Save"} ${product.name} ${wishlist.includes(product.id) ? "from" : "to"} wishlist`}
                      aria-pressed={wishlist.includes(product.id)}
                    >
                      <Heart
                        size={17}
                        fill={
                          wishlist.includes(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                    <button
                      className="product-image-button"
                      onClick={() => openProduct(product)}
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className={
                          product.id === "premium-suv"
                            ? "suv-product-image"
                            : ""
                        }
                      />
                      <span className="quick-view">
                        A closer look <ArrowUpRight size={14} />
                      </span>
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span>{product.label}</span>
                      <span className="product-rating">
                        <Star size={10} fill="currentColor" /> {product.rating}
                      </span>
                    </div>
                    <button
                      className="product-name"
                      onClick={() => openProduct(product)}
                    >
                      {product.name}
                    </button>
                    <p className="product-detail">{product.detail}</p>
                    <div className="product-price">
                      {currency(product.price)}
                      {product.original && (
                        <del>{currency(product.original)}</del>
                      )}
                    </div>
                    <button
                      className={`product-cta ${product.kind === "car" ? "vehicle-cta" : ""}`}
                      onClick={() =>
                        product.kind === "car"
                          ? openProduct(product)
                          : addToCart(product)
                      }
                    >
                      {product.kind === "car"
                        ? "Explore vehicle"
                        : "Add to bag"}
                      {product.kind === "car" ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {displayedProducts.length === 0 && (
            <div className="empty-state">
              <Heart size={34} strokeWidth={1.2} />
              <h3>Your next favourites are waiting.</h3>
              <p>Tap the heart on a product to save it here.</p>
              <button
                className="button button-red"
                onClick={() => {
                  setCategory("all");
                  setExpanded(true);
                }}
              >
                Explore the collection <ArrowRight size={16} />
              </button>
            </div>
          )}
          <Reveal>
            <div className="collection-footnote">
              <span>
                <BadgeCheck size={14} /> Every product verified. Every purchase
                protected.
              </span>
              <span>Only the best makes the cut.</span>
            </div>
          </Reveal>
        </section>

        <section
          className="promo-section section container"
          aria-label="Explore our collections"
        >
          <Reveal className="promo-grid">
            <div className="promo-block">
              <img
                src={iphone16Img}
                alt="Official Apple image of the iPhone 16 Pro Max in Desert Titanium"
                loading="lazy"
                className="promo-cutout"
              />
              <div className="promo-shade" />
              <div className="promo-copy">
                <span className="eyebrow">THE TECHNOLOGY COLLECTION</span>
                <h2>
                  Made for the everyday.
                  <br />
                  <em>Anything but ordinary.</em>
                </h2>
                <p>Extraordinary devices. Effortless possibilities.</p>
                <button className="text-link" onClick={() => browse("gadgets")}>
                  Discover gadgets <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
            <div className="promo-block">
              <img
                src={gleImg}
                alt="Mercedes-AMG GLE 53 (2025) SUV"
                loading="lazy"
                className="promo-cutout"
              />
              <div className="promo-shade" />
              <div className="promo-copy">
                <span className="eyebrow">THE AUTOMOTIVE COLLECTION</span>
                <h2>
                  Not just a drive.
                  <br />
                  <em>A statement.</em>
                </h2>
                <p>Distinctive vehicles. Uncompromising standards.</p>
                <button className="text-link" onClick={() => browse("cars")}>
                  Find your next car <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          id="swap-and-sell"
          className="swap-section section container"
          aria-labelledby="swap-title"
        >
          <Reveal>
            <div className="section-heading swap-heading">
              <div>
                <span className="eyebrow">SWAP, UPGRADE OR SELL OUTRIGHT</span>
                <h2 id="swap-title">
                  Trade in what you have. <em>Or sell it outright.</em>
                </h2>
                <p>
                  We buy and swap clean smartphones, laptops
                  and verified vehicles across Nigeria. Apply your instant
                  valuation toward any upgrade or receive same-day bank payout.
                </p>
              </div>
              <button
                className="button button-red"
                onClick={() => openSwapDesk("swap", "gadget")}
              >
                Open Swap &amp; Buyout Desk <ArrowUpRight size={17} />
              </button>
            </div>
          </Reveal>
          <div className="swap-cards-grid">
            <Reveal className="swap-card">
              <span className="eyebrow">01 / GADGET SWAP &amp; BUYBACK</span>
              <h3>Phones, MacBooks, iPads &amp; Consoles</h3>
              <p>
                Upgrade from your iPhone 13/14/15, Samsung Ultra, MacBook or PS5
                to the latest model and pay only the difference—or sell your
                clean device outright for instant transfer.
              </p>
              <div className="swap-examples">
                <span>iPhone 15 Pro Max · up to {currency(1350000)}</span>
                <span>Galaxy S24 Ultra · up to {currency(1320000)}</span>
                <span>MacBook Pro M2/M3 · up to {currency(1950000)}</span>
              </div>
              <div className="swap-card-actions">
                <button
                  className="button button-red"
                  onClick={() => openSwapDesk("swap", "gadget")}
                >
                  Swap a gadget <ArrowUpRight size={16} />
                </button>
                <button
                  className="button button-outline"
                  onClick={() => openSwapDesk("sell", "gadget")}
                >
                  Sell gadget for cash <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
            <Reveal className="swap-card" delay={0.08}>
              <span className="eyebrow">
                02 / VEHICLE SWAP &amp; ACQUISITION
              </span>
              <h3>Mercedes-Benz, Lexus, Toyota &amp; Range Rover</h3>
              <p>
                Drive in with your current vehicle and drive out in a newer
                model, or let LEETECH &amp; AUTOS buy your verified car outright
                following a transparent physical inspection in Lagos or Abuja.
              </p>
              <div className="swap-examples">
                <span>Mercedes-Benz C300 · up to {currency(29500000)}</span>
                <span>Lexus RX 350 F-Sport · up to {currency(34000000)}</span>
                <span>Range Rover / GLE · up to {currency(120000000)}</span>
              </div>
              <div className="swap-card-actions">
                <button
                  className="button button-red"
                  onClick={() => openSwapDesk("swap", "car")}
                >
                  Swap a vehicle <ArrowUpRight size={16} />
                </button>
                <button
                  className="button button-outline"
                  onClick={() => openSwapDesk("sell", "car")}
                >
                  Sell car outright <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="our-standard"
          className="value-section section container"
          aria-labelledby="value-title"
        >
          <Reveal className="value-intro">
            <span className="eyebrow">03 / THE LEETECH STANDARD</span>
            <h2 id="value-title">
              Excellence,
              <br />
              <em>without exception.</em>
            </h2>
            <p>
              A little more consideration.{" "}
              <br />A completely different experience.
            </p>
            <button className="text-link" onClick={() => openInfo("about")}>
              Get to know us <ArrowUpRight size={16} />
            </button>
          </Reveal>
          <div className="benefits-grid">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <Reveal className="benefit" key={title} delay={index * 0.035}>
                <Icon size={25} strokeWidth={1.4} />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          id="weekly-deals"
          className="section container"
          aria-labelledby="deals-title"
        >
          <Reveal>
            <div className="deal-banner">
              <img
                className="deal-image deal-cutout"
                src={airpodsImg}
                alt="Official Apple image of AirPods Pro 3 in the MagSafe Charging Case"
                loading="lazy"
              />
              <div className="deal-overlay" />
              <div className="deal-copy">
                <span className="eyebrow">
                  <Zap size={13} /> THE WEEKLY EDIT / UP TO 25% OFF
                </span>
                <h2 id="deals-title">
                  Good taste.
                  <br />
                  <em>Better timing.</em>
                </h2>
                <p>Exceptional finds. Extraordinary value. This week only.</p>
                <div className="deal-actions">
                  <button
                    className="button button-red"
                    onClick={() => browse("deals")}
                  >
                    Shop the drop <ArrowUpRight size={17} />
                  </button>
                  <div className="countdown-wrap">
                    <span>THIS WEEK'S EDIT ENDS IN</span>
                    <div
                      className="countdown"
                      role="timer"
                      aria-label="Time remaining in this week's deals"
                    >
                      {countdown.map((number, i) => (
                        <span key={i}>
                          {String(number).padStart(2, "0")}
                          <small>{["D", "H", "M", "S"][i]}</small>
                          {i < 3 && <b>:</b>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          className="buying-steps section container"
          aria-labelledby="buying-title"
        >
          <Reveal>
            <div className="section-heading">
              <div>
                <span className="eyebrow">HOW IT WORKS</span>
                <h2 id="buying-title">
                  Buying a car, <em>step by step.</em>
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="buying-grid">
            {buyingSteps.map((step, index) => (
              <Reveal
                key={step.title}
                className="buying-step"
                delay={index * 0.07}
              >
                <span className="buying-number">
                  0{index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="buying-policy">
            <p>Questions about returns, warranty or payment before you buy?</p>
            <div className="buying-policy-links">
              <button className="text-link" onClick={() => openInfo("returns")}>
                Returns <ArrowUpRight size={16} />
              </button>
              <button className="text-link" onClick={() => openInfo("warranty")}>
                Warranty <ArrowUpRight size={16} />
              </button>
              <button className="text-link" onClick={() => openInfo("payment")}>
                Payment terms <ArrowUpRight size={16} />
              </button>
            </div>
          </Reveal>
        </section>

        {SHOW_REVIEWS && (
        <section
          className="reviews-section section container"
          aria-labelledby="reviews-title"
        >
          <Reveal>
            <div className="section-heading reviews-heading">
              <div>
                <span className="eyebrow">04 / THE WORD ON LEETECH</span>
                <h2 id="reviews-title">
                  Good words. <em>Real people.</em>
                </h2>
              </div>
              <div className="overall-rating">
                <Stars />
                <span>
                  <strong>4.9</strong> / 5 <span>from our community</span>
                </span>
              </div>
            </div>
          </Reveal>
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <Reveal className="review" key={review.name} delay={index * 0.07}>
                <div className="review-top">
                  <Stars small />
                  <span>
                    <CircleCheck size={12} /> Verified purchase
                  </span>
                </div>
                <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
                <div className="review-author">
                  <div className="review-avatar">{review.initials}</div>
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.city}, Nigeria</span>
                  </div>
                  <span className="review-product">{review.product}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        )}

        <section
          className="newsletter-section"
          aria-labelledby="newsletter-title"
        >
          <div className="container newsletter-inner">
            <Reveal>
              <span className="eyebrow">
                A LITTLE CLOSER TO THE EXCEPTIONAL
              </span>
              <h2 id="newsletter-title">
                The privilege of <em>being first.</em>
              </h2>
              <p>
                New arrivals, considered edits, and a few things just for you.
              </p>
            </Reveal>
            <Reveal className="newsletter-form-wrap">
              {subscribedEmail ? (
                <div className="newsletter-success">
                  <CircleCheck size={23} />
                  <div>
                    <strong>You're on the list.</strong>
                    <span>Launch updates saved for {subscribedEmail}.</span>
                    <button
                      onClick={() => {
                        setSubscribedEmail("");
                        store("leetech-newsletter", "");
                      }}
                    >
                      Use a different email
                    </button>
                  </div>
                </div>
              ) : (
                <form className="newsletter-form" onSubmit={subscribe}>
                  <label className="sr-only" htmlFor="newsletter-email">
                    Your email address
                  </label>
                  <div className="newsletter-field">
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      required
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe to the newsletter"
                    >
                      <ArrowUpRight size={22} />
                    </button>
                  </div>
                  <p>
                    Only the good stuff. No spam, ever.{" "}
                    <button type="button" onClick={() => openInfo("privacy")}>
                      Privacy policy
                    </button>
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <a
        className="whatsapp-fab"
        href="https://wa.me/2349138130976"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with LEETECH & AUTOS on WhatsApp"
      >
        <MessageCircle size={24} aria-hidden="true" />
      </a>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#" aria-label="LEETECH and AUTOS home">
                <img
                  src={logoFull}
                  alt="LEETECH & AUTOS. Gadgets. Cars. Power."
                  width="220"
                  height="100"
                />
              </a>
              <p>
                Premium tech. Quality vehicles.
                <br />
                One destination for your next level.
              </p>
              <div className="footer-direct-contacts">
                <a
                  href="tel:09138130976"
                  className="footer-contact-pill"
                  aria-label="Call 09138130976"
                >
                  <Phone size={14} />
                  <span>09138130976</span>
                </a>
                <a
                  href="https://www.tiktok.com/@leetech.autos"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-contact-pill"
                  aria-label="TikTok leetech.autos"
                >
                  <TikTok size={14} />
                  <span>leetech.autos</span>
                </a>
              </div>
              <div className="social-links">
                <a
                  href="https://www.tiktok.com/@leetech.autos"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                >
                  <TikTok size={17} />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook size={17} />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="currentColor"
                  >
                    <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.5 5.4 22H2.2l7.2-8.3L1.6 2H8l4.5 6.9L18.9 2ZM17.8 20h1.7L7 3.9H5.2L17.8 20Z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-link-group">
              <h3>THE COLLECTION</h3>
              {(
                [
                  "phones",
                  "laptops",
                  "accessories",
                  "cars",
                ] as Category[]
              ).map((id) => (
                <button key={id} onClick={() => browse(id)}>
                  {categoryNames[id]}
                </button>
              ))}
            </div>
            <div className="footer-link-group">
              <h3>WE'RE HERE TO HELP</h3>
              {(
                [
                  ["support", "Contact & support"],
                  ["delivery", "Delivery information"],
                  ["returns", "Returns & exchanges"],
                  ["warranty", "Warranty"],
                  ["payment", "Payment options"],
                  ["faq", "FAQs"],
                ] as [InfoKey, string][]
              ).map(([id, label]) => (
                <button key={id} onClick={() => openInfo(id)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="footer-link-group footer-company">
              <h3>THE LEETECH WORLD</h3>
              <button onClick={() => openInfo("about")}>Our story</button>
              <button
                onClick={() =>
                  document
                    .getElementById("our-standard")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Our standard
              </button>
              <button onClick={() => browse("deals")}>Latest deals</button>
              <button onClick={showLatestDevices}>Latest devices</button>
              <button onClick={() => browse("saved")}>Your wishlist</button>
              <div className="footer-location">
                <span className="status-dot" /> Based in Nigeria.
                <br />
                <span>Built for your next move.</span>
              </div>
            </div>
          </div>
          <div className="footer-signature" aria-hidden="true">
            LEETECH <span>&amp; AUTOS.</span>
          </div>
          <div className="footer-bottom">
            <span>
              &copy; {new Date().getFullYear()} LEETECH &amp; AUTOS. All rights
              reserved.
            </span>
            <div>
              <button onClick={() => openInfo("privacy")}>
                Privacy policy
              </button>
              <button onClick={() => openInfo("terms")}>
                Terms of service
              </button>
            </div>
            <div className="payment-marks">
              <LockKeyhole size={12} />
              <span>Secure payments</span>
              <strong className="visa-mark">VISA</strong>
              <span className="mastercard-mark">
                <i />
                <i />
              </span>
              <strong className="verve-mark">verve</strong>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {overlay === "search" && (
          <Dialog
            key="search"
            title="FIND YOUR NEXT UPGRADE."
            onClose={closeDialog}
            wide
          >
            <div className="search-content">
              <div className="search-field">
                <Search size={21} />
                <input
                  data-autofocus
                  aria-label="Search our collection"
                  placeholder="Try iPhone, MacBook, Mercedes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="icon-button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
              <span className="search-results-label">
                {searchQuery
                  ? `${searchResults.length + latestSearchResults.length} ${searchResults.length + latestSearchResults.length === 1 ? "RESULT" : "RESULTS"} FOR YOUR NEXT MOVE`
                  : "POPULAR RIGHT NOW"}
              </span>
              <div className="search-results">
                {(searchQuery ? searchResults : products.slice(0, 4)).map(
                  (product) => (
                    <button
                      className="search-result"
                      key={product.id}
                      onClick={() => openProduct(product)}
                    >
                      <img src={product.image} alt="" />
                      <div>
                        <small>{product.label}</small>
                        <strong>{product.name}</strong>
                        <span>{currency(product.price)}</span>
                      </div>
                      <ArrowUpRight size={18} />
                    </button>
                  ),
                )}
                {latestSearchResults.map((device) => (
                  <button
                    className="search-result"
                    key={device.id}
                    onClick={() => openLatestDevice(device)}
                  >
                    <img src={device.detailImage} alt="" />
                    <div>
                      <small>
                        {device.maker.toUpperCase()} / LATEST DEVICES
                      </small>
                      <strong>{device.name}</strong>
                      <span className="latest-search-note">
                        Price on request
                      </span>
                    </div>
                    <ArrowUpRight size={18} />
                  </button>
                ))}
              </div>
              {searchQuery &&
                searchResults.length === 0 &&
                latestSearchResults.length === 0 && (
                  <div className="empty-state">
                    <Search size={28} />
                    <h3>No matches just yet.</h3>
                    <p>Try a brand, product name or category.</p>
                    <button
                      className="text-link"
                      onClick={() => setSearchQuery("")}
                    >
                      Explore popular picks <ArrowRight size={15} />
                    </button>
                  </div>
                )}
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "cart" && (
          <Dialog
            key="cart"
            title={`YOUR BAG (${cartCount})`}
            onClose={closeDialog}
            drawer
          >
            <div className="cart-body">
              {cart.length ? (
                <>
                  <div className="cart-quality">
                    <ShieldCheck size={16} /> Good choices. All verified.
                  </div>
                  <div className="cart-items">
                    {cart.map((item) => {
                      const product = products.find((p) => p.id === item.id)!;
                      const unitPrice = item.unitPrice ?? product.price;
                      const configSummary = [
                        item.finish,
                        item.tierLabel,
                        item.carePlus ? "Care+ Included" : undefined,
                        item.tradeIn ? "Trade-In Applied" : undefined,
                        item.swapItemName
                          ? `Swapped: ${item.swapItemName} (-${currency(item.swapCredit || 0)})`
                          : undefined,
                      ]
                        .filter(Boolean)
                        .join(" · ");
                      return (
                        <div className="cart-item" key={item.id}>
                          <img src={product.image} alt={product.name} />
                          <div className="cart-item-info">
                            <span className="cart-item-label">
                              {product.label}
                            </span>
                            <h3>{product.name}</h3>
                            {configSummary && (
                              <span className="cart-item-config">
                                {configSummary}
                              </span>
                            )}
                            <span className="cart-item-price">
                              {currency(unitPrice)}
                            </span>
                            <div className="cart-item-actions">
                              <div className="quantity-control">
                                <button
                                  onClick={() => changeQuantity(item.id, -1)}
                                  aria-label={`Decrease ${product.name} quantity`}
                                >
                                  <Minus size={12} />
                                </button>
                                <span aria-label="Quantity">
                                  {item.quantity}
                                </span>
                                <button
                                  disabled={item.quantity >= 99}
                                  onClick={() => changeQuantity(item.id, 1)}
                                  aria-label={`Increase ${product.name} quantity`}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button
                                className="remove-button"
                                onClick={() =>
                                  setCart((items) =>
                                    items.filter((i) => i.id !== item.id),
                                  )
                                }
                                aria-label={`Remove ${product.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cart-summary">
                    <div>
                      <span>Subtotal</span>
                      <strong>{currency(cartTotal)}</strong>
                    </div>
                    <p>
                      Delivery and any applicable fees confirmed at checkout.
                    </p>
                    <button
                      className="button button-red"
                      onClick={() => {
                        setOrderComplete("");
                        setOverlay("checkout");
                      }}
                    >
                      Continue to checkout <ArrowRight size={17} />
                    </button>
                    <span className="secure-note">
                      <LockKeyhole size={12} /> Safe, secure and always premium.
                    </span>
                    <button className="continue-shopping" onClick={closeDialog}>
                      Continue shopping
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-state cart-empty">
                  <ShoppingBag size={45} strokeWidth={1} />
                  <span className="eyebrow">ROOM FOR SOMETHING GREAT</span>
                  <h3>
                    Your next upgrade
                    <br />
                    belongs here.
                  </h3>
                  <p>Explore the collection and find your next favourite.</p>
                  <button
                    className="button button-red"
                    onClick={() => browse("all")}
                  >
                    Explore the collection <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "latest-device" && (
          <Dialog
            key="latest-device"
            title="THE LATEST. YOUR NEXT."
            onClose={closeDialog}
            wide
          >
            <LatestDeviceDetails
              key={selectedLatestDevice.id}
              device={selectedLatestDevice}
            />
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "product" && (
          <Dialog
            key="product"
            title="A CLOSER LOOK."
            onClose={closeDialog}
            wide
          >
            <div className="product-modal-content">
              <div className="product-modal-media">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <button
                  className={`product-heart ${wishlist.includes(selectedProduct.id) ? "is-saved" : ""}`}
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  aria-label="Toggle product wishlist"
                >
                  <Heart
                    size={21}
                    fill={
                      wishlist.includes(selectedProduct.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>
              {(() => {
                const config = getProductConfig(selectedProduct);
                const activeFinish =
                  config.finishes[selectedFinish] || config.finishes[0];
                const activeTier =
                  config.tiers[selectedTier] || config.tiers[0];
                const configuredPrice =
                  selectedProduct.price +
                  activeTier.delta +
                  (carePlus ? config.carePrice : 0);
                const handleConfiguredBagAdd = () => {
                  addToCart(selectedProduct, {
                    finish: activeFinish.name,
                    tierLabel: activeTier.label,
                    unitPrice: configuredPrice,
                    carePlus,
                    tradeIn,
                  });
                };
                return (
                  <div className="product-modal-info">
                    <span className="eyebrow">{selectedProduct.label}</span>
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.detail}</p>
                    <div className="modal-product-rating">
                      <Stars small />
                      <span>{selectedProduct.rating} / 5</span>
                    </div>
                    <div className="modal-price">
                      {currency(configuredPrice)}
                      {selectedProduct.original && selectedTier === 0 && (
                        <del>{currency(selectedProduct.original)}</del>
                      )}
                    </div>

                    <div className="apple-configurator">
                      <div className="config-group">
                        <span className="config-label">
                          {config.step1Label}:{" "}
                          <strong>{activeFinish.name}</strong>
                        </span>
                        <div
                          className="finish-swatches"
                          role="group"
                          aria-label={config.step1Label}
                        >
                          {config.finishes.map((finish, idx) => (
                            <button
                              type="button"
                              key={finish.name}
                              className={`finish-pill ${selectedFinish === idx ? "active" : ""}`}
                              onClick={() => setSelectedFinish(idx)}
                              aria-pressed={selectedFinish === idx}
                            >
                              <span
                                className="finish-dot"
                                style={{ background: finish.hex }}
                              />
                              <span>{finish.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="config-group">
                        <span className="config-label">
                          {config.step2Label}
                        </span>
                        <div className="tier-options">
                          {config.tiers.map((tier, idx) => (
                            <button
                              type="button"
                              key={tier.label}
                              className={`tier-option ${selectedTier === idx ? "active" : ""}`}
                              onClick={() => setSelectedTier(idx)}
                              aria-pressed={selectedTier === idx}
                            >
                              <div>
                                <strong>{tier.label}</strong>
                                <small>{tier.note}</small>
                              </div>
                              <span>
                                {tier.delta === 0
                                  ? "Included"
                                  : tier.delta > 0
                                    ? `+${currency(tier.delta)}`
                                    : currency(
                                        selectedProduct.price + tier.delta,
                                      )}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="config-addons">
                        <label className="config-addon">
                          <input
                            type="checkbox"
                            checked={carePlus}
                            onChange={(e) => setCarePlus(e.target.checked)}
                          />
                          <div>
                            <strong>{config.careTitle}</strong>
                            <small>+{currency(config.carePrice)}</small>
                          </div>
                        </label>
                        <label className="config-addon">
                          <input
                            type="checkbox"
                            checked={tradeIn}
                            onChange={(e) => setTradeIn(e.target.checked)}
                          />
                          <div>
                            <strong>{config.tradeInTitle}</strong>
                            <small>
                              Instant valuation applied on delivery / inspection
                            </small>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="product-specs">
                      {selectedProduct.specs.map((spec) => (
                        <span key={spec}>
                          <Check size={14} />
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="stock-note">
                      <span className="status-dot" />{" "}
                      {selectedProduct.kind === "car"
                        ? "Available for immediate inspection or online reservation"
                        : "In stock. Same-day Lagos dispatch · 24–48hr nationwide."}
                    </div>
                    <div className="modal-cta-stack">
                      <button
                        className="button button-red"
                        onClick={() => {
                          if (selectedProduct.kind === "car") {
                            setInspectionComplete(false);
                            setOverlay("inspection");
                          } else handleConfiguredBagAdd();
                        }}
                      >
                        {selectedProduct.kind === "car"
                          ? "Book an inspection"
                          : "Add to bag"}
                        {selectedProduct.kind === "car" ? (
                          <CalendarDays size={17} />
                        ) : (
                          <ShoppingBag size={17} />
                        )}
                      </button>
                      {selectedProduct.kind === "car" && (
                        <button
                          type="button"
                          className="button button-outline vehicle-bag-button"
                          onClick={handleConfiguredBagAdd}
                        >
                          Add vehicle to bag <ShoppingBag size={17} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="button button-outline swap-modal-trigger"
                        onClick={() =>
                          openSwapDesk(
                            "swap",
                            selectedProduct.kind,
                            selectedProduct.id,
                          )
                        }
                      >
                        {selectedProduct.kind === "car"
                          ? "Swap your current car for this"
                          : "Swap your current gadget for this"}{" "}
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <button
                      className="modal-secondary-action"
                      onClick={() => {
                        if (selectedProduct.kind === "car") openInfo("payment");
                        else setOverlay("cart");
                      }}
                    >
                      {selectedProduct.kind === "car"
                        ? "Explore payment options"
                        : `View your bag (${cartCount})`}
                      <ArrowRight size={14} />
                    </button>
                    <span className="secure-note">
                      <BadgeCheck size={13} /> Verified quality. No compromises.
                    </span>
                  </div>
                );
              })()}
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "checkout" && (
          <Dialog
            key="checkout"
            title={
              orderComplete ? "YOUR NEXT MOVE IS READY." : "MAKE IT YOURS."
            }
            onClose={closeDialog}
          >
            {orderComplete ? (
              <div className="form-success">
                <div className="success-icon">
                  <Check size={28} />
                </div>
                <span className="eyebrow">DEMO ORDER CREATED</span>
                <h3>An excellent choice.</h3>
                <p>
                  Your demo order <strong>{orderComplete}</strong> is saved on
                  this device. No payment has been taken and no real order has
                  been placed.
                </p>
                {lastOrderSummary && (
                  <div className="order-receipt-box">
                    <div className="receipt-header">
                      <span>REF: {lastOrderSummary.reference}</span>
                      <span>{lastOrderSummary.paymentMethod}</span>
                    </div>
                    {lastOrderSummary.items.map((item, idx) => (
                      <div className="receipt-item" key={idx}>
                        <div>
                          <strong>
                            {item.quantity}x {item.name}
                          </strong>
                          {item.config && <small>{item.config}</small>}
                        </div>
                        <span>{currency(item.price)}</span>
                      </div>
                    ))}
                    <div className="receipt-total">
                      <span>Total</span>
                      <strong>{currency(lastOrderSummary.total)}</strong>
                    </div>
                  </div>
                )}
                <button className="button button-red" onClick={closeDialog}>
                  Back to the good stuff <ArrowUpRight size={17} />
                </button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={checkout}>
                <div className="demo-notice">
                  <LockKeyhole size={16} />
                  <span>Storefront preview. No payment will be collected.</span>
                </div>
                <div className="checkout-total">
                  <span>
                    Your upgrade total{" "}
                    <small>
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </small>
                  </span>
                  <strong>{currency(cartTotal)}</strong>
                </div>
                <div className="form-grid">
                  <label>
                    Full name
                    <input
                      data-autofocus
                      name="name"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      name="phone"
                      type="tel"
                      pattern="[0-9+ ]{7,20}"
                      autoComplete="tel"
                      placeholder="0801 234 5678"
                      required
                    />
                  </label>
                  <label>
                    Delivery state
                    <select
                      name="state"
                      autoComplete="address-level1"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select your state
                      </option>
                      {[
                        "Abia",
                        "Adamawa",
                        "Akwa Ibom",
                        "Anambra",
                        "Bauchi",
                        "Bayelsa",
                        "Benue",
                        "Borno",
                        "Cross River",
                        "Delta",
                        "Ebonyi",
                        "Edo",
                        "Ekiti",
                        "Enugu",
                        "FCT Abuja",
                        "Gombe",
                        "Imo",
                        "Jigawa",
                        "Kaduna",
                        "Kano",
                        "Katsina",
                        "Kebbi",
                        "Kogi",
                        "Kwara",
                        "Lagos",
                        "Nasarawa",
                        "Niger",
                        "Ogun",
                        "Ondo",
                        "Osun",
                        "Oyo",
                        "Plateau",
                        "Rivers",
                        "Sokoto",
                        "Taraba",
                        "Yobe",
                        "Zamfara",
                      ].map((state) => (
                        <option key={state}>{state}</option>
                      ))}
                    </select>
                  </label>
                  <label className="full-width">
                    Delivery address
                    <input
                      name="address"
                      autoComplete="street-address"
                      placeholder="Street address and city"
                      required
                    />
                  </label>
                  <label className="full-width">
                    Payment &amp; fulfilment option
                    <select
                      name="paymentMethod"
                      defaultValue="Instant Transfer / Paystack Invoice"
                    >
                      <option value="Instant Transfer / Paystack Invoice">
                        Instant Bank Transfer / Paystack Invoice
                      </option>
                      <option value="Pay on Verified Delivery / Escrow">
                        Pay on Verified Delivery / Escrow Inspection
                      </option>
                      <option value="Flexible 3–6 Month Instalment Plan">
                        Flexible 3–6 Month Instalment Plan
                      </option>
                    </select>
                  </label>
                </div>
                <label className="form-checkbox">
                  <input type="checkbox" required />
                  <span>
                    I understand this is a demo checkout. No real order or
                    payment will be processed.
                  </span>
                </label>
                <button className="button button-red" type="submit">
                  Create demo order <ArrowRight size={17} />
                </button>
              </form>
            )}
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "inspection" && (
          <Dialog
            key="inspection"
            title="MEET YOUR NEXT DRIVE."
            onClose={closeDialog}
          >
            {inspectionComplete ? (
              <div className="form-success">
                <div className="success-icon">
                  <CalendarDays size={27} />
                </div>
                <span className="eyebrow">INSPECTION REQUEST SAVED</span>
                <h3>One step closer.</h3>
                <p>
                  Your preferred inspection details for the{" "}
                  {selectedProduct.name} are saved on this device. This is a
                  preview; a live appointment has not been booked.
                </p>
                <button className="button button-red" onClick={closeDialog}>
                  Back to the collection <ArrowUpRight size={17} />
                </button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={bookInspection}>
                <div className="inspection-vehicle">
                  <img src={selectedProduct.image} alt="" />
                  <div>
                    <span className="eyebrow">YOUR NEXT DRIVE</span>
                    <strong>{selectedProduct.name}</strong>
                    <span>{selectedProduct.detail}</span>
                  </div>
                </div>
                <p className="form-intro">
                  Great cars deserve a closer look. Tell us when you'd like to
                  see yours.
                </p>
                <div className="form-grid">
                  <label>
                    Full name
                    <input
                      data-autofocus
                      name="name"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      name="phone"
                      type="tel"
                      pattern="[0-9+ ]{7,20}"
                      autoComplete="tel"
                      placeholder="0801 234 5678"
                      required
                    />
                  </label>
                  <label>
                    Preferred date
                    <input
                      name="date"
                      type="date"
                      min={new Date(Date.now() + 86400000)
                        .toISOString()
                        .slice(0, 10)}
                      required
                    />
                  </label>
                  <label>
                    Preferred time
                    <select name="time" required defaultValue="">
                      <option value="" disabled>
                        Select a time
                      </option>
                      <option>10:00 AM</option>
                      <option>12:00 PM</option>
                      <option>2:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </label>
                </div>
                <div className="demo-notice">
                  <CalendarDays size={16} />
                  <span>
                    Preview only. This saves a request, not a confirmed
                    appointment.
                  </span>
                </div>
                <button className="button button-red" type="submit">
                  Save inspection request <ArrowRight size={17} />
                </button>
              </form>
            )}
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "swap" && (
          <Dialog
            key="swap"
            title={
              swapReference
                ? "SWAP / BUYOUT OFFER SAVED."
                : "SWAP OR SELL YOUR GADGET OR CAR."
            }
            onClose={closeDialog}
            wide
          >
            {(() => {
              const itemsForKind = swapCatalog[swapKind];
              const currentSwapItem =
                itemsForKind.find((i) => i.id === swapItemId) ||
                itemsForKind[0];
              const conditionObj =
                swapConditions.find((c) => c.id === swapCondition) ||
                swapConditions[0];
              const estimatedCredit = Math.round(
                currentSwapItem.baseValue * conditionObj.factor,
              );
              const targetProduct =
                products.find((p) => p.id === swapTargetId) || products[0];
              const netBalance = Math.max(
                0,
                targetProduct.price - estimatedCredit,
              );
              const cashBack = Math.max(
                0,
                estimatedCredit - targetProduct.price,
              );

              if (swapReference) {
                return (
                  <div className="form-success">
                    <div className="success-icon">
                      <Check size={28} />
                    </div>
                    <span className="eyebrow">
                      DIRECT BUYOUT / SWAP VALUATION SAVED
                    </span>
                    <h3>Valuation locked in.</h3>
                    <p>
                      Your {swapMode === "sell" ? "direct sale" : "swap"}{" "}
                      reference <strong>{swapReference}</strong> for{" "}
                      <strong>{currentSwapItem.name}</strong> (estimated at{" "}
                      <strong>{currency(estimatedCredit)}</strong>) is saved on
                      this device. Final payout or swap credit is confirmed
                      after a 15-minute physical verification in Lagos or Abuja.
                    </p>
                    <button className="button button-red" onClick={closeDialog}>
                      Back to the collection <ArrowUpRight size={17} />
                    </button>
                  </div>
                );
              }

              return (
                <div className="swap-desk-body">
                  <div className="swap-mode-tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={swapMode === "swap"}
                      className={swapMode === "swap" ? "active" : ""}
                      onClick={() => setSwapMode("swap")}
                    >
                      Swap toward an upgrade
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={swapMode === "sell"}
                      className={swapMode === "sell" ? "active" : ""}
                      onClick={() => setSwapMode("sell")}
                    >
                      Sell outright to LEETECH
                    </button>
                  </div>

                  <div className="swap-kind-switch">
                    <span className="config-label">
                      WHAT ARE YOU TRADING OR SELLING?
                    </span>
                    <div className="finish-swatches">
                      <button
                        type="button"
                        className={`finish-pill ${swapKind === "gadget" ? "active" : ""}`}
                        onClick={() => {
                          setSwapKind("gadget");
                          setSwapItemId(swapCatalog.gadget[0].id);
                          setSwapTargetId("iphone-16-pro-max");
                        }}
                      >
                        <Smartphone size={14} /> Gadget (Phone, Laptop, Tablet,
                        Console)
                      </button>
                      <button
                        type="button"
                        className={`finish-pill ${swapKind === "car" ? "active" : ""}`}
                        onClick={() => {
                          setSwapKind("car");
                          setSwapItemId(swapCatalog.car[0].id);
                          setSwapTargetId("premium-suv");
                        }}
                      >
                        <CarFront size={14} /> Vehicle (Sedan, SUV, 4x4)
                      </button>
                    </div>
                  </div>

                  <div className="form-grid swap-form-grid">
                    <label>
                      Your current {swapKind === "car" ? "vehicle" : "device"}
                      <select
                        value={currentSwapItem.id}
                        onChange={(e) => setSwapItemId(e.target.value)}
                      >
                        {itemsForKind.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — up to {currency(item.baseValue)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Condition
                      <select
                        value={swapCondition}
                        onChange={(e) =>
                          setSwapCondition(
                            e.target.value as "mint" | "good" | "fair",
                          )
                        }
                      >
                        {swapConditions.map((cond) => (
                          <option key={cond.id} value={cond.id}>
                            {cond.label} ({Math.round(cond.factor * 100)}%) —{" "}
                            {cond.note}
                          </option>
                        ))}
                      </select>
                    </label>

                    {swapMode === "swap" && (
                      <label className="full-width">
                        Upgrade to (any LEETECH gadget or vehicle)
                        <select
                          value={swapTargetId}
                          onChange={(e) => setSwapTargetId(e.target.value)}
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.detail}) —{" "}
                              {currency(product.price)}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>

                  <div className="swap-valuation-panel">
                    <div>
                      <span className="eyebrow">
                        ESTIMATED{" "}
                        {swapMode === "sell" ? "CASH BUYOUT" : "TRADE-IN"} VALUE
                      </span>
                      <strong>{currency(estimatedCredit)}</strong>
                      <small>{conditionObj.note}</small>
                    </div>
                    {swapMode === "swap" && (
                      <div className="swap-math">
                        <div>
                          <span>Target: {targetProduct.name}</span>
                          <span>{currency(targetProduct.price)}</span>
                        </div>
                        <div>
                          <span>Less trade-in ({currentSwapItem.name})</span>
                          <span className="swap-credit">
                            -{currency(estimatedCredit)}
                          </span>
                        </div>
                        <div className="swap-net">
                          <span>
                            {cashBack > 0
                              ? "Estimated cash back to you"
                              : "Net balance to pay"}
                          </span>
                          <strong>
                            {currency(cashBack > 0 ? cashBack : netBalance)}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {swapMode === "swap" ? (
                    <div className="swap-actions-footer">
                      <button
                        type="button"
                        className="button button-red"
                        onClick={() => {
                          addToCart(targetProduct, {
                            finish: "Standard Finish",
                            tierLabel:
                              cashBack > 0
                                ? `Even Swap (+${currency(cashBack)} Payout)`
                                : "Swap + Top-Up Upgrade",
                            unitPrice: netBalance,
                            tradeIn: true,
                            swapItemName: `${currentSwapItem.name} (${conditionObj.label})`,
                            swapCredit: estimatedCredit,
                          });
                          setOverlay("cart");
                        }}
                      >
                        Apply swap &amp; add upgrade to bag{" "}
                        <ShoppingBag size={17} />
                      </button>
                      <span className="secure-note">
                        <BadgeCheck size={13} /> Your trade-in credit is
                        deducted from the item total in your bag.
                      </span>
                    </div>
                  ) : (
                    <form
                      className="swap-sell-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const data = Object.fromEntries(
                          new FormData(event.currentTarget),
                        );
                        const ref = `SW-${Date.now().toString().slice(-6)}`;
                        store("leetech-swap-offer", {
                          reference: ref,
                          mode: "sell",
                          kind: swapKind,
                          item: currentSwapItem.name,
                          condition: conditionObj.label,
                          estimatedPayout: estimatedCredit,
                          seller: data,
                          demo: true,
                        });
                        setSwapReference(ref);
                      }}
                    >
                      <div className="form-grid">
                        <label>
                          Your full name
                          <input
                            data-autofocus
                            name="sellerName"
                            placeholder="Your full name"
                            required
                          />
                        </label>
                        <label>
                          Phone / WhatsApp number
                          <input
                            name="sellerPhone"
                            type="tel"
                            pattern="[0-9+ ]{7,20}"
                            placeholder="0801 234 5678"
                            required
                          />
                        </label>
                        <label>
                          Inspection &amp; payout location
                          <select
                            name="city"
                            required
                            defaultValue="Lagos (Victoria Island)"
                          >
                            <option>Lagos (Victoria Island)</option>
                            <option>Lagos (Ikeja)</option>
                            <option>Abuja (Wuse II / Maitama)</option>
                            <option>Port Harcourt</option>
                            <option>Ibadan</option>
                          </select>
                        </label>
                        <label>
                          Payout preference
                          <select
                            name="payoutMethod"
                            defaultValue="Instant Bank Transfer (NIP)"
                          >
                            <option>Instant Bank Transfer (NIP)</option>
                            <option>Store Credit (+5% Bonus Value)</option>
                          </select>
                        </label>
                      </div>
                      <button type="submit" className="button button-red">
                        Lock in cash buyout offer ({currency(estimatedCredit)}){" "}
                        <ArrowRight size={17} />
                      </button>
                    </form>
                  )}
                </div>
              );
            })()}
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "info" && (
          <Dialog key="info" title="THE LEETECH WORLD." onClose={closeDialog}>
            <div className="info-content">
              <span className="eyebrow">GADGETS. CARS. POWER.</span>
              <h3>{infoContent[infoKey].title}</h3>
              <p className="info-intro">{infoContent[infoKey].intro}</p>
              <div className="info-details">
                {infoContent[infoKey].details.map((detail, index) => (
                  <p key={index}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {detail}
                  </p>
                ))}
              </div>
              {infoKey === "support" && (
                <div className="support-direct-links">
                  <a href="tel:09138130976" className="footer-contact-pill">
                    <Phone size={15} />
                    <span>Call 09138130976</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@leetech.autos"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-contact-pill"
                  >
                    <TikTok size={15} />
                    <span>TikTok: leetech.autos</span>
                  </a>
                </div>
              )}
              {infoKey === "about" ? (
                <div className="logo-downloads">
                  <span className="eyebrow">
                    OUR LOGO / TRANSPARENT BACKGROUND
                  </span>
                  {[
                    {
                      name: "For dark backgrounds",
                      tile: "logo-tile-dark",
                      preview: logoFull,
                      svg: logoFull,
                      file: "leetech-and-autos-logo",
                    },
                    {
                      name: "For light backgrounds",
                      tile: "logo-tile-light",
                      preview: logoLight,
                      svg: logoLight,
                      file: "leetech-and-autos-logo-light",
                    },
                  ].map((logo) => (
                    <div className="logo-download" key={logo.name}>
                      <div className={`logo-tile ${logo.tile}`}>
                        <img
                          src={logo.preview}
                          alt=""
                          width="220"
                          height="100"
                        />
                      </div>
                      <div className="logo-download-links">
                        <strong>{logo.name}</strong>
                        <a
                          className="text-link"
                          href={logo.svg}
                          download={`${logo.file}.svg`}
                        >
                          Download {logo.name.toLowerCase()} (SVG){" "}
                          <ArrowUpRight size={14} />
                        </a>
                        <button
                          className="text-link"
                          onClick={() =>
                            downloadLogoPng(logo.preview, `${logo.file}.png`)
                          }
                        >
                          Download {logo.name.toLowerCase()} (PNG){" "}
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <button className="text-link" onClick={() => browse("all")}>
                  Find your next upgrade <ArrowUpRight size={16} />
                </button>
              )}
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            <span className="toast-icon">
              <Check size={16} />
            </span>
            <span>{toast.message}</span>
            {toast.cart && (
              <button
                onClick={() => {
                  setToast(null);
                  setOverlay("cart");
                }}
              >
                View bag <ArrowUpRight size={13} />
              </button>
            )}
            <button
              className="toast-close"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
