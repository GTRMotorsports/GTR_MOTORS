'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/product-card';
import { fetchProducts, fetchBrands, fetchCategories, fetchManufacturers } from '@/lib/api';
import type { Product, Brand } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import carBg from '@/lib/bg/image4.jpeg';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<{id:string;name:string;imageBase64?:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, brandsData, categoriesData, manufacturersData] = await Promise.all([
          fetchProducts(),
          fetchBrands(),
          fetchCategories(),
          fetchManufacturers(),
        ]);
        setProducts(productsData.items || []);
        setBrands(brandsData || []);
        setCategories(categoriesData || []);
        setManufacturers(manufacturersData || []);
        setMounted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading products:', err);
        setMounted(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesManufacturer = selectedManufacturer === 'all' || (product.manufacturer || '') === selectedManufacturer;

      return matchesSearch && matchesBrand && matchesCategory && matchesManufacturer;
    });
    console.log('Filtered products:', filtered.length, { selectedBrand, selectedCategory, searchTerm });
    return filtered;
  }, [products, searchTerm, selectedBrand, selectedCategory, selectedManufacturer, brands, categories]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedManufacturer('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedBrand !== 'all' || selectedCategory !== 'all' || selectedManufacturer !== 'all';

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 mx-4 mt-4 rounded-lg">
          Error: {error}
        </div>
      )}
      
      {loading ? (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 && !error ? (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-400">No products available</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters - Sticky on Desktop */}
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 h-fit">
            <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-xl shadow-black/50">
              <div className="flex items-center gap-2 mb-6 text-red-500">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="text-xl font-bold font-headline tracking-wide uppercase">Filters</h2>
              </div>

              {/* Manufacturer Filter */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Manufacturer</label>
                <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                  <SelectTrigger className="w-full bg-[#0f0f12] border-white/10 text-white rounded-lg focus:ring-red-500/50">
                    <SelectValue placeholder="All Manufacturers" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
                    <SelectItem value="all">All Manufacturers</SelectItem>
                    {manufacturers.map(m => (
                      <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search</label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  <Input
                    placeholder="Search parts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0f0f12] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500/50 transition-all rounded-lg"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full bg-[#0f0f12] border-white/10 text-white rounded-lg focus:ring-red-500/50">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.name}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full bg-[#0f0f12] border-white/10 text-white rounded-lg focus:ring-red-500/50">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filter Clear Button */}
                <AnimatePresence>
                  {hasActiveFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        size="sm"
                        className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40"
                      >
                        <X className="w-4 h-4 mr-2" /> Clear Filters
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            <div className="flex items-center justify-between mb-8 bg-[#1a1a1a]/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                All Products
              </h1>
              <span className="text-gray-400 text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {filteredProducts.length} Results
              </span>
            </div>

            {/* Manufacturer quick filter icons */}
            <div className="flex gap-3 items-center mb-6">
              {manufacturers.map((m) => (
                <button key={m.id} onClick={() => setSelectedManufacturer(selectedManufacturer === m.name ? 'all' : m.name)} className={`p-2 rounded border ${selectedManufacturer === m.name ? 'border-red-500' : 'border-white/10'}`}>
                  {m.imageBase64 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imageBase64} alt={m.name} className="h-8 w-20 object-contain" />
                  ) : (
                    <div className="text-sm text-gray-300 px-2">{m.name}</div>
                  )}
                </button>
              ))}
            </div>

            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 text-center bg-[#1a1a1a]/50 rounded-2xl border border-white/5 border-dashed"
              >
                <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-300">No products found</p>
                <p className="text-gray-500 mt-2 mb-6">Try adjusting your filters or search terms.</p>
                <Button
                  onClick={clearFilters}
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
