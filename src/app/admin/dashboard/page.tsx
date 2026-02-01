"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { BarChart, Users, Package, Settings, LogOut, Edit2, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { fetchBrands, fetchProducts, fetchManufacturers, createBrand, updateBrand, deleteBrand, createProduct, updateProduct, deleteProduct, createManufacturer, updateManufacturer, deleteManufacturer } from '@/lib/api';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [view, setView] = useState<'dashboard'|'users'|'products'|'settings'|'manage-products'|'manage-brands'|'manage-manufacturers'>('dashboard');
    const { toast } = useToast();
    const [brands, setBrands] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<any[]>([]);
    const [manufacturers, setManufacturers] = useState<any[]>([]);

    useEffect(() => {
        if(view === 'manage-brands') loadBrands();
        if(view === 'manage-products') loadProducts();
        if(view === 'manage-manufacturers') loadManufacturers();
    }, [view]);

    async function loadManufacturers(){
        try{
            const m = await fetchManufacturers();
            setManufacturers(m || []);
        }catch(e){ console.error(e); }
    }

    async function loadBrands(){
        try{
            const b = await fetchBrands();
            setBrands(b || []);
        }catch(e){ console.error(e); }
    }

    async function loadProducts(){
        try{
            const r = await fetchProducts();
            setProductsList(r.items || []);
        }catch(e){ console.error(e); }
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/admin/login");
        }
    }, [user, loading, router]);

    if (!mounted || loading || !user) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex min-h-screen w-full relative">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/60 backdrop-blur-xl hidden md:block fixed h-full z-10">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-red-500">Admin Portal</h2>
                </div>
                <nav className="space-y-2 px-4">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-red-400">
                        <BarChart className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10">
                        <Users className="mr-2 h-4 w-4" /> Users
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10">
                        <Package className="mr-2 h-4 w-4" /> Products
                    </Button>
                    <div className="mt-2">
                        <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manage</div>
                        <Button onClick={() => setView('manage-products')} variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10">
                            <Package className="mr-2 h-4 w-4" /> Manage Products
                        </Button>
                        <Button onClick={() => setView('manage-brands')} variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10">
                            <Settings className="mr-2 h-4 w-4" /> Manage Brands
                        </Button>
                        <Button onClick={() => setView('manage-manufacturers')} variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10">
                            <Settings className="mr-2 h-4 w-4" /> Manage Manufacturers
                        </Button>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <Button
                        variant="outline"
                        className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => auth.signOut()}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64 relative z-0">
                <div className="flex items-center justify-between space-y-2 mb-8 bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-lg">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                    <div className="text-sm text-gray-400">
                        Logged in as <span className="text-white font-medium">{user.email}</span>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { title: "Total Revenue", value: "₹45,231.89", change: "+20.1% from last month", icon: null },
                        { title: "Subscriptions", value: "+2350", change: "+180.1% from last month", icon: null },
                        { title: "Sales", value: "+12,234", change: "+19% from last month", icon: null },
                        { title: "Active Now", value: "+573", change: "+201 since last hour", icon: null },
                    ].map((item, i) => (
                        <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md text-white shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">{item.title}</CardTitle>
                                {item.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <p className="text-xs text-gray-500 mt-1">{item.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Manage Inventory Forms */}
                {view === 'manage-brands' && (
                    <div className="mt-8 max-w-3xl">
                        <Card className="bg-black/40 border-white/5 text-white">
                            <CardHeader>
                                <CardTitle>Create Brand</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BrandForm onSuccess={async (b) => {
                                    toast({ title: 'Brand created', description: `${b.name} created successfully` });
                                    await loadBrands();
                                }} />
                                <div className="mt-6">
                                    <h3 className="text-sm text-gray-300 mb-2">Existing Brands</h3>
                                    <div className="space-y-2">
                                        {brands.map((br) => (
                                            <div key={br.id} className="flex items-center justify-between bg-white/3 p-3 rounded">
                                                <div>
                                                    <div className="font-medium">{br.name}</div>
                                                    <div className="text-xs text-gray-400">{br.logoHint}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => { (window as any).__brandPopulate?.(br); }}><Edit2 /></Button>
                                                    <Button size="sm" variant="destructive" onClick={async () => { if(confirm('Delete brand?')){ try{ await deleteBrand(br.id); toast({ title: 'Deleted', description: br.name }); await loadBrands(); }catch(e){ alert((e as Error).message||'Error'); } } }}><Trash2 /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {view === 'manage-manufacturers' && (
                    <div className="mt-8 max-w-3xl">
                        <Card className="bg-black/40 border-white/5 text-white">
                            <CardHeader>
                                <CardTitle>Manage Manufacturers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ManufacturerForm onSuccess={async (m:any) => { toast({ title: 'Manufacturer saved', description: `${m.name} saved` }); await loadManufacturers(); }} />
                                <div className="mt-6">
                                    <h3 className="text-sm text-gray-300 mb-2">Existing Manufacturers</h3>
                                    <div className="space-y-2">
                                        {manufacturers.map((m) => (
                                            <div key={m.id} className="flex items-center justify-between bg-white/3 p-3 rounded">
                                                <div className="flex items-center gap-3">
                                                    {m.imageBase64 ? <img src={m.imageBase64} alt={m.name} className="h-8 w-8 rounded" /> : null}
                                                    <div>
                                                        <div className="font-medium">{m.name}</div>
                                                        <div className="text-xs text-gray-400">{(m.models||[]).join(', ')}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => { (window as any).__manufacturerPopulate?.(m); }}><Edit2 /></Button>
                                                    <Button size="sm" variant="destructive" onClick={async () => { if(confirm('Delete manufacturer?')){ try{ await deleteManufacturer(m.id); toast({ title: 'Deleted', description: m.name }); await loadManufacturers(); }catch(e){ alert((e as Error).message||'Error'); } } }}><Trash2 /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {view === 'manage-products' && (
                    <div className="mt-8 max-w-3xl">
                        <Card className="bg-black/40 border-white/5 text-white">
                            <CardHeader>
                                <CardTitle>Create Product</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProductForm onSuccess={async (p) => {
                                    toast({ title: 'Product created', description: `${p.name} created successfully` });
                                    await loadProducts();
                                }} />
                                <div className="mt-6">
                                    <h3 className="text-sm text-gray-300 mb-2">Existing Products</h3>
                                    <div className="space-y-2">
                                        {productsList.map((pr) => (
                                            <div key={pr.id} className="flex items-center justify-between bg-white/3 p-3 rounded">
                                                <div>
                                                    <div className="font-medium">{pr.name}</div>
                                                    <div className="text-xs text-gray-400">{pr.brand} • ₹{pr.price}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => { (window as any).__productPopulate?.(pr); }}><Edit2 /></Button>
                                                    <Button size="sm" variant="destructive" onClick={async () => { if(confirm('Delete product?')){ try{ await deleteProduct(pr.id); toast({ title: 'Deleted', description: pr.name }); await loadProducts(); }catch(e){ alert((e as Error).message||'Error'); } } }}><Trash2 /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}

function ManufacturerForm({ onSuccess }: { onSuccess?: (m: any) => void }){
    const [name, setName] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [models, setModels] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    (window as any).__manufacturerPopulate = (m: any) => {
        setEditingId(m.id);
        setName(m.name || '');
        setImageBase64(m.imageBase64 || '');
        setModels((m.models || []).join(', '));
    }

    async function fileToBase64(file: File | null) {
        if(!file) return '';
        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>){
        const f = e.target.files?.[0] || null;
        if(!f) return;
        try{
            const data = await fileToBase64(f);
            setImageBase64(data);
        }catch(err){ console.error(err); alert('Failed to read file'); }
    }

    async function submit(e: React.FormEvent){
        e.preventDefault();
        setLoading(true);
        try{
            const payload = { name, imageBase64: imageBase64 || undefined, models: models ? models.split(',').map(s=>s.trim()).filter(Boolean) : undefined };
            if(editingId){
                const updated = await updateManufacturer(editingId, payload);
                setEditingId(null);
                onSuccess?.(updated);
            }else{
                const created = await createManufacturer(payload);
                onSuccess?.(created);
            }
            setName(''); setImageBase64(''); setModels('');
        }catch(err){ console.error(err); alert((err as Error).message||'Error'); }
        finally{ setLoading(false); }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="text-sm text-gray-300 block mb-1">Name</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Manufacturer name" required />
            </div>
            <div>
                <label className="text-sm text-gray-300 block mb-1">Logo (file or paste base64)</label>
                <Input type="file" onChange={handleFileChange} />
                <Textarea value={imageBase64} onChange={(e)=>setImageBase64(e.target.value)} placeholder="data:image/png;base64,... (optional)" />
            </div>
            <div>
                <label className="text-sm text-gray-300 block mb-1">Models (comma separated)</label>
                <Input value={models} onChange={(e)=>setModels(e.target.value)} placeholder="Model A, Model B" />
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="bg-red-600">{loading? (editingId? 'Updating...':'Creating...'):(editingId? 'Update Manufacturer':'Create Manufacturer')}</Button>
                {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setName(''); setImageBase64(''); setModels(''); }}>Cancel</Button>}
            </div>
        </form>
    )
}

function BrandForm({ onSuccess }: { onSuccess?: (b: any) => void }){
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [logoHint, setLogoHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // populate from parent list edit button
    (window as any).__brandPopulate = (b: any) => {
        setEditingId(b.id);
        setName(b.name || '');
        setLogoUrl(b.logoUrl || '');
        setLogoHint(b.logoHint || '');
    }

    async function submit(e: React.FormEvent){
        e.preventDefault();
        setLoading(true);
        try{
            if(editingId){
                const updated = await updateBrand(editingId, { name, logoUrl, logoHint });
                setEditingId(null);
                onSuccess?.(updated);
            }else{
                const created = await createBrand({ name, logoUrl, logoHint });
                onSuccess?.(created);
            }
            setName(''); setLogoUrl(''); setLogoHint('');
        }catch(err){
            console.error(err);
            alert((err as Error).message || 'Error');
        }finally{ setLoading(false); }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="text-sm text-gray-300 block mb-1">Name</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Brand name" required />
            </div>
            <div>
                <label className="text-sm text-gray-300 block mb-1">Logo URL</label>
                <Input value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="https://..." required />
            </div>
            <div>
                <label className="text-sm text-gray-300 block mb-1">Logo Hint</label>
                <Input value={logoHint} onChange={(e)=>setLogoHint(e.target.value)} placeholder="brand logo" required />
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="bg-red-600">{loading? (editingId? 'Updating...':'Creating...'):(editingId? 'Update Brand':'Create Brand')}</Button>
                {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setName(''); setLogoUrl(''); setLogoHint(''); }}>Cancel</Button>}
            </div>
        </form>
    )
}

function ProductForm({ onSuccess }: { onSuccess?: (p: any) => void }){
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('Engine');
    const [imageUrl, setImageUrl] = useState('');
    const [imageHint, setImageHint] = useState('');
    const [rating, setRating] = useState('0');
    const [reviewCount, setReviewCount] = useState('0');
    const [discount, setDiscount] = useState('');
    const [loading, setLoading] = useState(false);
    const [brands, setBrandsLocal] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(()=>{
        (async ()=>{
            try{ const b = await fetchBrands(); setBrandsLocal(b || []); }catch(e){ console.error(e); }
        })();
    }, []);

    // allow parent list to populate for editing
    (window as any).__productPopulate = (p: any) => {
        setEditingId(p.id);
        setName(p.name || '');
        setDescription(p.description || '');
        setPrice(String(p.price || ''));
        setBrand(p.brand || '');
        setCategory(p.category || 'Engine');
        setImageUrl(p.imageUrl || '');
        setImageHint(p.imageHint || '');
        setRating(String(p.rating || '0'));
        setReviewCount(String(p.reviewCount || '0'));
        setDiscount(p.discount !== undefined ? String(p.discount) : '');
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try{
            const payload: any = {
                name, description, price: parseFloat(price), brand, category, imageUrl, imageHint,
                rating: parseFloat(rating || '0'), reviewCount: parseInt(reviewCount || '0'),
            };
            if(discount!=='') payload.discount = parseInt(discount);

            if(editingId){
                const data = await updateProduct(editingId, payload);
                setEditingId(null);
                setName(''); setDescription(''); setPrice(''); setBrand(''); setCategory('Engine'); setImageUrl(''); setImageHint(''); setRating('0'); setReviewCount('0'); setDiscount('');
                onSuccess?.(data);
            }else{
                const data = await createProduct(payload);
                setName(''); setDescription(''); setPrice(''); setBrand(''); setCategory('Engine'); setImageUrl(''); setImageHint(''); setRating('0'); setReviewCount('0'); setDiscount('');
                onSuccess?.(data);
            }
        }catch(err){
            console.error(err);
            alert((err as Error).message || 'Error');
        }finally{ setLoading(false); }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="text-sm text-gray-300 block mb-1">Name</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Product name" required />
            </div>
            <div>
                <label className="text-sm text-gray-300 block mb-1">Description</label>
                <Textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short description" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Price (INR)</label>
                    <Input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="1999.99" required type="number" step="0.01" min="0" />
                </div>
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Brand</label>
                    <Select value={brand} onValueChange={(v)=>setBrand(v)}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Brand" /></SelectTrigger>
                        <SelectContent>
                            {brands.map((b)=> (<SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Category</label>
                    <Select value={category} onValueChange={(v)=>setCategory(v)}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Engine">Engine</SelectItem>
                            <SelectItem value="Brakes">Brakes</SelectItem>
                            <SelectItem value="Suspension">Suspension</SelectItem>
                            <SelectItem value="Exhaust">Exhaust</SelectItem>
                            <SelectItem value="Interior">Interior</SelectItem>
                            <SelectItem value="Exterior">Exterior</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Image URL</label>
                    <Input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="https://..." required />
                </div>
            </div>
            <div>
                <label className="text-sm text-gray-300 block mb-1">Image Hint</label>
                <Input value={imageHint} onChange={(e)=>setImageHint(e.target.value)} placeholder="image hint" required />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Rating</label>
                    <Input value={rating} onChange={(e)=>setRating(e.target.value)} type="number" step="0.1" min="0" max="5" />
                </div>
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Review Count</label>
                    <Input value={reviewCount} onChange={(e)=>setReviewCount(e.target.value)} type="number" min="0" />
                </div>
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Discount (%)</label>
                    <Input value={discount} onChange={(e)=>setDiscount(e.target.value)} type="number" min="0" max="100" />
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="bg-red-600">{loading? (editingId? 'Updating...':'Creating...'):(editingId? 'Update Product':'Create Product')}</Button>
                {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setName(''); setDescription(''); setPrice(''); setBrand(''); setCategory('Engine'); setImageUrl(''); setImageHint(''); setRating('0'); setReviewCount('0'); setDiscount(''); }}>Cancel</Button>}
            </div>
        </form>
    )
}
