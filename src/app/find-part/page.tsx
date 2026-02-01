'use client';

import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProductCard } from '@/components/product-card';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import { UploadCloud, X, Wand2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Status = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';

export default function FindPartPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setAllProducts(data.items);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    };
    loadProducts();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus('idle');
      setResults([]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setStatus('idle');
      setResults([]);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
    setProgress(0);
    setResults([]);
  };

  const handleFindPart = () => {
    if (!file) return;

    setStatus('uploading');
    setProgress(0);
    const uploadInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(uploadInterval);
          setStatus('analyzing');
          // Simulate AI analysis
          setTimeout(() => {
            // Pick 3 random products as results
            const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
            setResults(shuffled.slice(0, 3));
            setStatus('success');
          }, 2000);
          return 100;
        }
        return p + 10;
      });
    }, 100);
  };
  
  const uploadPlaceholder = PlaceHolderImages.find(p => p.id === 'part-upload-placeholder');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto">
        <Wand2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="font-headline text-4xl font-bold mt-4">AI Part Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Don't know the name? Just upload a picture of the part, and our AI will find it for you.
        </p>
      </div>

      <Card className="mt-10 max-w-4xl mx-auto p-8">
        {!preview ? (
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">
              Drag & drop your image here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PNG, JPG, or WEBP up to 10MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Part preview"
                fill
                className="object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={reset}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {status === 'idle' && (
              <Button size="lg" className="mt-6" onClick={handleFindPart}>
                <Wand2 className="mr-2" /> Find My Part
              </Button>
            )}
          </div>
        )}

        {(status === 'uploading' || status === 'analyzing') && (
          <div className="mt-6 text-center">
            <p className="font-semibold mb-2">
              {status === 'uploading'
                ? 'Uploading Image...'
                : 'Analyzing with AI...'}
            </p>
            <Progress value={status === 'uploading' ? progress : 100} className="w-full" />
            {status === 'analyzing' && <p className="text-sm text-muted-foreground mt-2">Our AI is identifying your part. This may take a moment.</p>}
          </div>
        )}
      </Card>

      {status === 'success' && (
        <div className="mt-12">
          <h2 className="font-headline text-3xl font-bold text-center mb-8">
            Our AI Found These Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
           <div className="text-center mt-8">
             <Button variant="outline" onClick={reset}>Try another image</Button>
           </div>
        </div>
      )}
       {!file && uploadPlaceholder && (
         <div className="mt-12 max-w-4xl mx-auto opacity-30">
          <Image src={uploadPlaceholder.imageUrl} alt={uploadPlaceholder.description} data-ai-hint={uploadPlaceholder.imageHint} width={800} height={600} className="rounded-lg"/>
         </div>
       )}
    </div>
  );
}
