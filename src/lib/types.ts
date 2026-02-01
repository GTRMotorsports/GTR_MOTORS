export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  manufacturer?: string | null;
  brand: string;
  category: 'Engine' | 'Brakes' | 'Suspension' | 'Exhaust' | 'Interior' | 'Exterior' | string;
  imageUrl: string;
  imageHint?: string | null;
  rating?: number;
  reviewCount?: number;
  discount?: number | null;
};

export type Brand = {
  id: string;
  name: string;
  logoUrl?: string | null;
  logoHint?: string | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  total: number;
  items: CartItem[];
};
