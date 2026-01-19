'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, totalItems, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Your Cart</h1>
        {totalItems > 0 && (
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        )}
      </div>
      {totalItems > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <Card key={product.id} className="flex items-center p-4 bg-black/50 backdrop-blur-md border-white/10 text-white shadow-lg">
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={product.imageHint}
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-sm text-gray-400">
                    {product.brand}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-bold text-red-500">
                      Rs {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {product.discount && product.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        Rs {((product.price) / (1 - (product.discount / 100))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-white/10 rounded-md bg-black/20">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/10 hover:text-white"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/10 hover:text-white"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(product.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-1 h-fit sticky top-24 bg-black/50 backdrop-blur-md border-white/10 text-white shadow-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rs {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>Rs 150.00</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between font-bold text-lg text-white">
                  <span>Total</span>
                  <span>Rs {(cartTotal + 150).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <Link href="/checkout" className="w-full block">
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white border-0">
                    Proceed to Checkout <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-lg bg-black/20 backdrop-blur-sm">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-500" />
          <h2 className="mt-6 text-xl font-semibold text-white">Your cart is empty</h2>
          <p className="mt-2 text-gray-400">
            Looks like you haven't added any parts yet.
          </p>
          <Link href="/products" className="mt-6 inline-block">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
