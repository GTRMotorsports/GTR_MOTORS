'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { fetchProducts, fetchBrands } from '@/lib/api';
import type { Product, Brand } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import heroBg from '@/lib/bg/image.png';
import heroBg1 from '@/lib/bg/image1.jpeg';
import heroBg2 from '@/lib/bg/image2.jpeg';
import heroBg3 from '@/lib/bg/image3.jpeg';
import heroBg4 from '@/lib/bg/image4.jpeg';
import heroBg5 from '@/lib/bg/image5.jpeg';
import heroBg6 from '@/lib/bg/image6.jpeg';
import heroBg7 from '@/lib/bg/image7.jpeg';
import heroBg8 from '@/lib/bg/image8.jpeg';
import gtrBanner from '@/lib/bg/gtr-banner.png';

import bilsteinLogo from '@/lib/brands/bilstein.jpeg';
import febiLogo from '@/lib/brands/febi-bilstein.png';
import lemforderLogo from '@/lib/brands/lemforder.png';
import lukLogo from '@/lib/brands/luk.jpeg';
import meyleLogo from '@/lib/brands/meyle-automotive-spare-parts.svg';
import sachsLogo from '@/lib/brands/sachs.svg';

import { ArrowRight, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import { animate as anime } from 'animejs';
import { ExclusiveDeals } from '@/components/exclusive-deals';
import { CarSeparator } from '@/components/car-separator';
import { FloatingActions } from '@/components/floating-actions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const heroImages = [heroBg, heroBg1, heroBg2, heroBg3, heroBg4, heroBg5, heroBg6, heroBg7, heroBg8];

const leadingBrands = [
  { name: 'Bilstein', logo: bilsteinLogo },
  { name: 'Febi Bilstein', logo: febiLogo },
  { name: 'Lemforder', logo: lemforderLogo },
  { name: 'LuK', logo: lukLogo },
  { name: 'Meyle', logo: meyleLogo },
  { name: 'Sachs', logo: sachsLogo },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  const featuredProducts = products.slice(0, 8);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [emblaRefFeatured, emblaApiFeatured] = useEmblaCarousel({ loop: true, align: 'start' });

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, brandsData] = await Promise.all([
          fetchProducts(),
          fetchBrands(),
        ]);
        setProducts(productsData.items || []);
        setBrands(brandsData || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const scrollPrevFeatured = useCallback(() => {
    if (emblaApiFeatured) emblaApiFeatured.scrollPrev();
  }, [emblaApiFeatured]);

  const scrollNextFeatured = useCallback(() => {
    if (emblaApiFeatured) emblaApiFeatured.scrollNext();
  }, [emblaApiFeatured]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const orbRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!orbRefs.current.length) return;

    const animations = orbRefs.current.map((el, index) =>
      anime(el, {
        translateX: ['-12%', '12%'],
        translateY: ['-8%', '10%'],
        scale: [1, 1.18],
        rotate: index % 2 === 0 ? ['-2deg', '2deg'] : ['2deg', '-2deg'],
        opacity: [0.35, 0.6],
        direction: 'alternate',
        ease: 'easeInOutSine',
        duration: 5200 + index * 400,
        loop: true,
        delay: index * 240
      })
    );

    return () => animations.forEach((animation) => animation.pause());
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [AutoScroll({ speed: 1.5, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false })]
  );

  // ... (remove leadingBrandsRef hook)

  // ...



  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const orbPositions = [
    { top: '12%', left: '10%' },
    { top: '52%', left: '20%' },
    { top: '32%', right: '12%' },
    { bottom: '8%', left: '56%' }
  ];

  const speedLines = [
    { top: '22%', delay: 0 },
    { top: '42%', delay: 0.6 },
    { top: '62%', delay: 1.1 }
  ];

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]); // Parallax effect

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white text-black">
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,87,34,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_70%_75%,rgba(239,68,68,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.04)_20%,transparent_20%),linear-gradient(300deg,rgba(0,0,0,0.05)_20%,transparent_20%)] [background-size:22px_22px]" />
      </div>
      {/* Hero Section */}
      <section className="relative w-full h-[510px] text-white overflow-hidden bg-[#050505]">
        <motion.div
          className="absolute inset-0"
          style={{ y }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2, // Slightly slower fade for drama
                ease: "easeInOut",
                delay: isFirstLoad && currentImageIndex === 0 ? 0.8 : 0 // Delay only on first load
              }}
              onAnimationComplete={() => setIsFirstLoad(false)}
            >
              <Image
                src={heroImages[currentImageIndex]}
                alt="Hero Background"
                fill
                className="object-cover bg-[#050505]"
                priority={currentImageIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.22),transparent_45%),radial-gradient(circle_at_70%_65%,rgba(249,115,22,0.18),transparent_40%)] mix-blend-screen blur-2xl"
          animate={{ opacity: [0.18, 0.32, 0.18], x: ["-4%", "4%", "-4%"], y: ["-2%", "3%", "-2%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          {speedLines.map((line, index) => (
            <motion.div
              key={index}
              className="absolute h-[2px] w-48 md:w-64 bg-gradient-to-r from-red-400/40 via-orange-400/70 to-transparent"
              style={{ top: line.top }}
              initial={{ x: '-30%' }}
              animate={{ x: '130%' }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: 'linear', delay: line.delay }}
            />
          ))}
          {orbPositions.map((style, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) orbRefs.current[index] = el;
              }}
              className="absolute rounded-full bg-gradient-to-br from-red-500/35 via-orange-400/25 to-amber-200/15 blur-3xl mix-blend-screen"
              style={{ width: '16rem', height: '16rem', ...style }}
            />
          ))}
          <div className="absolute inset-x-6 bottom-10 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              {/* Trust Badge Mockup - REPLACED WITH GTR BANNER */}
              <motion.div
                className="relative w-full max-w-[300px] h-24 mx-auto mb-6 flex items-center justify-center p-2"
                // animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={gtrBanner}
                  alt="GTR Banner"
                  width={500}
                  height={200}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-red-500 font-bold text-xl tracking-wider uppercase mb-2">
              Buy Trustworthy Auto Parts
            </motion.h2>
            <motion.h1 variants={fadeInUp} className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
              We don't just sell parts — We deliver performance assurance
            </motion.h1>

            <Link href="/products">
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}>
                <Button size="lg" className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-full px-8 py-6 text-lg shadow-2xl shadow-red-600/30 border border-white/10">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <motion.section
        id="brands"
        className="relative py-14 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,87,34,0.16),transparent_32%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.06),transparent_28%)]" aria-hidden />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col items-center mb-6">
            <h2 className="font-headline text-3xl font-bold text-center text-white drop-shadow">
              Shop by Brands
            </h2>
            <motion.div
              className="h-[2px] w-24 bg-gradient-to-r from-transparent via-red-400 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="relative group px-4 sm:px-10">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {[...brands, ...brands, ...brands, ...brands].map((brand, index) =>
                  brand.logoUrl ? (
                    <div className="flex-[0_0_50%] md:flex-[0_0_25%] lg:flex-[0_0_16.666%] pl-4 min-w-0" key={`${brand.id}-${index}`}>
                      <Link
                        href={`/products?brand=${brand.name}`}
                        className="flex flex-col items-center justify-center p-4 h-32 transition-all duration-300 group/brand hover:scale-105"
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={brand.logoUrl}
                            alt={`${brand.name} Logo`}
                            width={120}
                            height={80}
                            className="object-contain transition-all opacity-80 group-hover/brand:opacity-100 group-hover/brand:drop-shadow-[0_10px_30px_rgba(239,68,68,0.35)]"
                            data-ai-hint={brand.logoHint}
                          />
                        </div>
                      </Link>
                    </div>
                  ) : null
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      <ExclusiveDeals />

      <CarSeparator />

      <motion.section
        className="relative pb-16 md:pb-24 pt-0 bg-[#1a1a1a] text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.08),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(0,0,0,0.04),transparent_30%)]" aria-hidden />
        <div className="container mx-100 px-4 mb-5 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-headline text-5xl font-bold text-red-600">Featured Products</h2>
              <p className="text-sm text-gray-300 mt-1">Curated picks enthusiasts love right now.</p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/products" className="hidden md:block">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20">
                  View All <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden" ref={emblaRefFeatured}>
            <div className="flex -ml-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4 min-w-0">
                  <motion.div variants={fadeInUp} whileHover={{ y: -6 }} className="h-full">
                    <ProductCard product={product} />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Car Indicator Style Navigation */}
          <div className="flex justify-center items-center gap-12 mt-10">
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-black border-2 border-red-700 text-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] active:scale-95"
              onClick={scrollPrevFeatured}
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-black border-2 border-red-700 text-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] active:scale-95"
              onClick={scrollNextFeatured}
              aria-label="Next Slide"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </motion.section>

      <CarSeparator />

      {/* Leading Automotive Brands Section */}
      <motion.section
        className="relative py-5 pb-10 bg-gradient-to-b from-neutral-900 to-black text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)]" aria-hidden />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 drop-shadow-md text-red-600">
            Leading Automotive Brands
            <span className="block text-lg md:text-xl font-normal text-gray-400 mt-2">
              Precision, Power & Reliability
            </span>
          </h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {leadingBrands.map((brand, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="w-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.9, // Stagger effect for the wave
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                  className="w-full h-32 flex items-center justify-center p-6 bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 rounded-xl shadow-lg transition-all duration-300 hover:shadow-red-900/20 hover:ring-2 hover:ring-red-500/50 cursor-pointer border border-white/40"
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={160}
                    height={80}
                    className="object-contain max-h-full w-auto mix-blend-multiply"
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
