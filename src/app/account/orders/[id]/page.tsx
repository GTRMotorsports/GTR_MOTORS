import Image from 'next/image';
import { notFound } from 'next/navigation';
import { orders } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Truck, Package, Home } from 'lucide-react';

const statusMap = {
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 0,
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);
  // In a real app, you might show an order confirmation even if it's not in the mock list yet
  const isMockOrder = !order;

  if (!order && !isMockOrder) {
    notFound();
  }
  
  const currentStatus = order ? order.status : 'Processing';
  const statusLevel = statusMap[currentStatus] || 1;
  
  const finalOrder = order || {
    id: id,
    date: new Date().toISOString().split('T')[0],
    status: 'Processing',
    total: 0,
    items: [],
  };

  const getStatusVariant = (status: (typeof orders)[0]['status']) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'Shipped':
        return 'secondary';
      case 'Processing':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle className="font-headline text-3xl">
                Order {finalOrder.id}
              </CardTitle>
              <CardDescription>
                Placed on {new Date(finalOrder.date).toLocaleDateString()}
              </CardDescription>
            </div>
             <Badge variant={getStatusVariant(currentStatus)} className="text-base px-4 py-1">
                {currentStatus}
              </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="my-8">
            <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -translate-y-1/2">
                <div className="h-1 bg-primary" style={{width: `${(statusLevel - 1) / 2 * 100}%`}}/>
              </div>
              
              {[
                { icon: Package, label: 'Processing', level: 1 },
                { icon: Truck, label: 'Shipped', level: 2 },
                { icon: Home, label: 'Delivered', level: 3 }
              ].map(({icon: Icon, label, level}) => (
                <div key={label} className="z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusLevel >= level ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-5 h-5"/>
                  </div>
                  <p className={`mt-2 text-sm font-medium ${statusLevel >= level ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8" />
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Items Ordered</h3>
              {finalOrder.items.length > 0 ? (
                <div className="space-y-4">
                  {finalOrder.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover border"
                        data-ai-hint={product.imageHint}
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <p className="ml-auto font-medium">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-8 bg-muted rounded-lg">
                  <CheckCircle className="mx-auto h-8 w-8 text-primary"/>
                  <p className="mt-2 font-semibold">Your order is confirmed!</p>
                  <p className="text-sm">We are preparing your items. Details will appear here shortly.</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>John Doe</p>
                <p>123 Main St</p>
                <p>Anytown, USA 12345</p>
              </div>
              <Separator className="my-4"/>
               <div className="flex justify-between font-bold">
                  <p>Order Total</p>
                  <p>${finalOrder.total.toFixed(2)}</p>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
