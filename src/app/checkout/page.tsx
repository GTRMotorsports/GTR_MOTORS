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
import { Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is too short'),
  state: z.string().min(2, 'State is too short'),
  zip: z.string().min(5, 'Invalid ZIP code'),
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, totalItems, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    },
  });

  // Load Razorpay script on component mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!razorpayLoaded) {
      toast({
        title: 'Error',
        description: 'Payment system is not loaded. Please refresh the page.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order in database
      const orderItems = cartItems.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

      const createOrderRes = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!createOrderRes.ok) {
        const errorData = await createOrderRes.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create order');
      }

      const { order: createdOrder } = await createOrderRes.json();
      const orderId = createdOrder.id;

      // Step 2: Create Razorpay order
      const amountInPaise = Math.round(cartTotal * 100 + 15 * 100); // shipping cost 15 INR

      const razorpayOrderRes = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise / 100,
          currency: 'INR',
          receipt: orderId,
        }),
      });

      if (!razorpayOrderRes.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const razorpayOrder = await razorpayOrderRes.json();

      // Step 3: Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RqCnsOMCYIvn4L',
        amount: amountInPaise,
        currency: 'INR',
        name: 'GTR Motors',
        description: `Order ${orderId}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Step 4: Verify payment
            const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: razorpayOrder.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId,
                shipping_details: {
                  name: values.name,
                  email: values.email,
                  phone: values.phone,
                  address: values.address,
                  city: values.city,
                  state: values.state,
                  zip: values.zip,
                },
              }),
            });

            if (!verifyRes.ok) {
              throw new Error('Payment verification failed');
            }

            // Success!
            clearCart();
            toast({
              title: 'Order Placed!',
              description: 'Your order has been successfully placed.',
            });
            router.push(`/account/orders/${orderId}`);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: 'Payment Failed',
              description: error instanceof Error ? error.message : 'Payment verification failed',
              variant: 'destructive',
            });
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: values.name,
          email: values.email,
          contact: values.phone,
        },
        theme: {
          color: '#EA580C',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred during checkout',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
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
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="john@example.com" type="email" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91 9999999999" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Mumbai" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="MH" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                      <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="400001" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
                <div className="border-t border-white/10 pt-8">
                  <p className="text-sm text-gray-400">
                    <Lock className="inline h-4 w-4 mr-2" />
                    Payment will be securely processed through Razorpay
                  </p>
                </div>
              </CardContent>
            </Card>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full backdrop-blur-md mt-8 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Pay ₹{(cartTotal + 15).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
