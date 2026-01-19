'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is too short'),
  state: z.string().min(2, 'State is too short'),
  zip: z.string().min(5, 'Invalid ZIP code'),
  cardNumber: z.string().length(16, 'Invalid card number'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid format (MM/YY)'),
  cvc: z.string().length(3, 'Invalid CVC'),
});

export default function CheckoutPage() {
  const { cartItems, cartTotal, totalItems, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Order submitted:', values);
    toast({
      title: 'Order Placed!',
      description: 'Your order has been successfully placed.',
    });
    clearCart();
    const mockOrderId = `TQ${Math.floor(Math.random() * 90000) + 10000}`;
    router.push(`/account/orders/${mockOrderId}`);
  }

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-headline font-bold mb-4 text-white">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8 text-lg">You need to add items to your cart before you can check out.</p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
          <Link href="/products">Return to Catalog</Link>
        </Button>
      </div>
    )
  }

  const shippingCost = 15.00;
  const orderTotal = cartTotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <h1 className="text-4xl md:text-5xl font-headline font-bold mb-8 text-center drop-shadow-md">
        Checkout
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="bg-black/50 backdrop-blur-md border-white/10 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden border border-white/10">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={product.imageHint} />
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-400">Qty: {quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                )
                )}
                <div className="mt-6 border-t border-white/10 pt-6 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <p>Subtotal</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <p>Shipping</p>
                    <p>${shippingCost.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-white">
                    <p>Total</p>
                    <p>${orderTotal.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-black/50 backdrop-blur-md border-white/10 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Shipping & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-semibold font-headline">Shipping Address</h3>
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="CA" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                      <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="12345" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
                <div className="border-t border-white/10 pt-8 space-y-4">
                  <h3 className="font-semibold font-headline flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Details</h3>
                  <FormField control={form.control} name="cardNumber" render={({ field }) => (
                    <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="expiry" render={({ field }) => (
                      <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="cvc" render={({ field }) => (
                      <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full backdrop-blur-md mt-8 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20">
              <Lock className="mr-2 h-5 w-5" />
              Place Order Securely
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
