"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    code: product?.code || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const APIBASE = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${APIBASE}/category`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const APIBASE = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(product ? `${APIBASE}/product/${product._id}` : `${APIBASE}/product`, {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      
      // Call onSave callback if provided, otherwise navigate
      if (onSave) {
        onSave();
      } else {
        router.push('/product');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Code</label>
        <input 
          name="code" 
          value={form.code} 
          onChange={handleChange} 
          className="border border-gray-300 rounded px-3 py-2 w-full" 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          className="border border-gray-300 rounded px-3 py-2 w-full" 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          className="border border-gray-300 rounded px-3 py-2 w-full" 
          rows={3}
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input 
          name="price" 
          type="number" 
          step="0.01"
          value={form.price} 
          onChange={handleChange} 
          className="border border-gray-300 rounded px-3 py-2 w-full" 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select 
          name="category" 
          value={form.category} 
          onChange={handleChange} 
          className="border border-gray-300 rounded px-3 py-2 w-full" 
          required
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {product ? 'Update' : 'Create'} Product
        </button>
        {product && onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
