import type { Product, Brand, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  // Use a png placeholder to avoid SVG restrictions in next/image
  return image || { imageUrl: 'https://placehold.co/600x600/png', imageHint: 'placeholder' };
}

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'V8 Turbocharger Kit',
    description: 'Boost your engine\'s performance with this state-of-the-art turbocharger kit. Designed for V8 engines, it provides a significant increase in horsepower and torque.',
    price: 1999.99,
    brand: 'Apex Performance',
    manufacturer: 'Apex Performance',
    category: 'Engine',
    rating: 4.8,
    reviewCount: 125,
    discount: 15,
    ...findImage('turbocharger')
  },
  {
    id: 'prod_2',
    name: 'Performance Brake Kit',
    description: 'Upgrade your stopping power with this complete performance brake kit. Includes 6-piston calipers, drilled and slotted rotors, and high-performance pads.',
    price: 1299.00,
    brand: 'GridLock',
    manufacturer: 'GridLock',
    category: 'Brakes',
    rating: 4.9,
    reviewCount: 98,
    discount: 10,
    ...findImage('brake-kit')
  },
  {
    id: 'prod_3',
    name: 'Adjustable Coilover Suspension',
    description: 'Dial in your ride height and damping with this fully adjustable coilover kit. Perfect for both street and track use.',
    price: 1450.50,
    brand: 'Velocity Works',
    manufacturer: 'Velocity Works',
    category: 'Suspension',
    rating: 4.7,
    reviewCount: 76,
    discount: 25,
    ...findImage('suspension-kit')
  },
  {
    id: 'prod_4',
    name: 'Titanium Cat-Back Exhaust',
    description: 'A full titanium exhaust system that not only reduces weight but also gives your car an aggressive, throaty sound.',
    price: 2500.00,
    brand: 'Nitro Drive',
    manufacturer: 'Nitro Drive',
    category: 'Exhaust',
    rating: 4.5,
    reviewCount: 45,
    discount: 5,
    ...findImage('exhaust-system')
  },
  {
    id: 'prod_5',
    name: 'Carbon Fiber Racing Seat',
    description: 'Shed weight and stay planted in the corners with this ultra-lightweight carbon fiber racing seat. FIA approved.',
    price: 1800.00,
    brand: 'Quantum Racing',
    manufacturer: 'Quantum Racing',
    category: 'Interior',
    rating: 4.6,
    reviewCount: 62,
    discount: 12,
    ...findImage('racing-seat')
  },
  {
    id: 'prod_6',
    name: 'Racing Steering Wheel',
    description: 'Alcantara-wrapped steering wheel for maximum grip and a premium feel. Features a red centering stripe.',
    price: 450.00,
    brand: 'Apex Performance',
    manufacturer: 'Apex Performance',
    category: 'Interior',
    rating: 4.6,
    reviewCount: 88,
    discount: 8,
    ...findImage('steering-wheel')
  },
  {
    id: 'prod_7',
    name: '19" Forged Alloy Wheels',
    description: 'A set of 4 lightweight forged alloy wheels in matte black. Stronger and lighter than cast wheels for improved performance.',
    price: 3200.00,
    brand: 'ForgeLine',
    manufacturer: 'ForgeLine',
    category: 'Exterior',
    rating: 4.8,
    reviewCount: 62,
    discount: 10,
    ...findImage('forged-wheels')
  },
  {
    id: 'prod_8',
    name: 'Cold Air Intake System',
    description: 'Increase airflow to your engine for better throttle response and more horsepower. Includes a high-flow reusable air filter.',
    price: 399.99,
    brand: 'Velocity Works',
    manufacturer: 'Velocity Works',
    category: 'Engine',
    rating: 4.5,
    reviewCount: 210,
    discount: 5,
    ...findImage('intake-system')
  },
];

import logo1 from './logos/logo1.png';
import logo2 from './logos/logo2.png';
import logo3 from './logos/logo3.png';
import logo4 from './logos/logo4.png';
import logo5 from './logos/logo5.svg';
import logo6 from './logos/logo6.png';
import logo7 from './logos/logo7.png';
import lamborghini from './logos/lamborghini.svg';

import logo8 from './logos/logo8.png';
import logo9 from './logos/logo9.png';

const toBrandLogo = (brandId: string, name: string, logo: any): Brand => {
  return { id: brandId, name, logoUrl: logo.src || logo, logoHint: 'brand logo' };
};

export const brands: Brand[] = [
  toBrandLogo('brand_1', 'Apex Performance', lamborghini),
  toBrandLogo('brand_2', 'Nitro Drive', logo1),
  toBrandLogo('brand_3', 'ForgeLine', logo2),
  toBrandLogo('brand_4', 'Velocity Works', logo3),
  toBrandLogo('brand_5', 'Quantum Racing', logo4),
  toBrandLogo('brand_6', 'GridLock', logo5),
  toBrandLogo('brand_7', 'Turbo Tech', logo7),
  toBrandLogo('brand_8', 'Iron Horse', logo6),
  toBrandLogo('brand_9', 'Stealth Ops', logo8),
  toBrandLogo('brand_10', 'Power Shift', logo9),
];

export const orders: Order[] = [
  {
    id: 'TQ12943',
    date: '2024-07-15',
    status: 'Delivered',
    total: 1750.49,
    items: [
      { product: products[2], quantity: 1 },
      { product: products[5], quantity: 1 },
    ]
  },
  {
    id: 'TQ12855',
    date: '2024-07-28',
    status: 'Shipped',
    total: 2500.00,
    items: [
      { product: products[3], quantity: 1 }
    ]
  },
  {
    id: 'TQ13001',
    date: '2024-08-01',
    status: 'Processing',
    total: 3600.00,
    items: [
      { product: products[6], quantity: 1 },
      { product: products[4], quantity: 2 },
    ]
  }
];

export const categories = Array.from(new Set(products.map(p => p.category)));
