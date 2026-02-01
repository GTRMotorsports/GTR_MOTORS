'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchProductById, fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { ProductCard } from '@/components/product-card';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(params.id);
        setProduct(productData);

        // Fetch related products by category
        const allProducts = await fetchProducts({ category: productData.category });
        const related = allProducts.items
          .filter(p => p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const relatedProductsList = relatedProducts;

  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.imageHint}
          />
          {product.discount && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-sm shadow-md z-10">
              {product.discount}% OFF
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="font-headline text-3xl lg:text-4xl font-bold">
            {product.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            by{' '}
            <span className="text-foreground font-medium">{product.brand}</span>
          </p>

          <div className="flex items-center mt-4">
            <div className="flex items-center text-yellow-400">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-5 h-5 fill-current" />
              ))}
              {halfStar && <Star key="half" className="w-5 h-5 fill-current" />}
              {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                <Star key={`empty-${i}`} className="w-5 h-5 text-gray-400" />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold mt-4">${product.price.toFixed(2)}</p>
          <Separator className="my-6" />
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          <Separator className="my-6" />

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-grow" onClick={() => addToCart(product, quantity)}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <h2 className="font-headline text-3xl font-bold mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
