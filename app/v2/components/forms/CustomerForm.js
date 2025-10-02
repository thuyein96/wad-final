"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerForm({ customer, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: customer?.name || '',
    dateOfBirth: customer?.dateOfBirth?.split('T')[0] || '',
    memberNumber: customer?.memberNumber || '',
    interests: customer?.interests?.join(', ') || '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Convert interests string to array
      const formData = { ...form };
      if (formData.interests) {
        formData.interests = formData.interests.split(',').map(interest => interest.trim());
      }

      const res = await fetch(customer ? `${API_BASE}/customer/${customer._id}` : `${API_BASE}/customer`, {
        method: customer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save');
      
      // Call onSave callback if provided, otherwise navigate
      if (onSave) {
        onSave();
      } else {
        router.push('/customer');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Member Number</label>
        <input name="memberNumber" type="number" value={form.memberNumber} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Interests</label>
        <input name="interests" type="text" placeholder="e.g. movies, football, gym, gaming" value={form.interests} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 w-full" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {customer ? 'Update' : 'Create'} Customer
        </button>
        {customer && onCancel && (
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
