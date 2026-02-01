import type { Product, Brand } from './types';

const API_BASE_URL = 'http://localhost:4000';

export interface ProductsResponse {
  items: Product[];
  total: number;
}

export async function fetchProducts(params?: {
  q?: string;
  brand?: string;
  manufacturer?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.q) queryParams.append('q', params.q);
  if (params?.brand) queryParams.append('brand', params.brand);
  if (params?.manufacturer) queryParams.append('manufacturer', params.manufacturer);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.minPrice !== undefined) queryParams.append('minPrice', String(params.minPrice));
  if (params?.maxPrice !== undefined) queryParams.append('maxPrice', String(params.maxPrice));
  if (params?.sort) queryParams.append('sort', params.sort);

  const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchManufacturers(): Promise<{id:string;name:string;imageBase64?:string;models?:string[]}[]> {
  const response = await fetch(`${API_BASE_URL}/manufacturers`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to fetch manufacturers');
  return response.json();
}

export async function createManufacturer(payload: { name: string; imageBase64?: string; models?: string[] }) {
  const res = await fetch(`${API_BASE_URL}/manufacturers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create manufacturer');
  return res.json();
}

export async function updateManufacturer(manuId: string, payload: { name: string; imageBase64?: string; models?: string[] }) {
  const res = await fetch(`${API_BASE_URL}/manufacturers/${manuId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update manufacturer');
  return res.json();
}

export async function deleteManufacturer(manuId: string) {
  const res = await fetch(`${API_BASE_URL}/manufacturers/${manuId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete manufacturer');
}

export async function fetchProductById(productId: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchBrands(): Promise<Brand[]> {
  const response = await fetch(`${API_BASE_URL}/brands`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }

  return response.json();
}

export async function createBrand(payload: { name: string; logoUrl: string; logoHint: string }): Promise<Brand> {
  const res = await fetch(`${API_BASE_URL}/brand`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create brand');
  return res.json();
}

export async function updateBrand(brandId: string, payload: { name: string; logoUrl: string; logoHint: string }): Promise<Brand> {
  const res = await fetch(`${API_BASE_URL}/brand/${brandId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update brand');
  return res.json();
}

export async function deleteBrand(brandId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/brand/${brandId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete brand');
}

export async function createProduct(payload: any): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(productId: string, payload: any): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/product/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(productId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/product/${productId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}
