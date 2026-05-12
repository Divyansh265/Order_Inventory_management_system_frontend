import { useState } from 'react';
import api from '../../api/axios';

const fields = [
    { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Wireless Mouse' },
    { label: 'SKU', key: 'sku', type: 'text', placeholder: 'e.g. MOU-001' },
    { label: 'Price ($)', key: 'price', type: 'number', placeholder: '0.00' },
    { label: 'Stock Quantity', key: 'stockQuantity', type: 'number', placeholder: '0' },
];

const ProductForm = ({ product, onSaved, onCancel }) => {
    const [form, setForm] = useState({
        name: product?.name || '',
        sku: product?.sku || '',
        price: product?.price || '',
        stockQuantity: product?.stockQuantity ?? '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.sku || form.price === '' || form.stockQuantity === '') {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: form.name,
                sku: form.sku,
                price: parseFloat(form.price),
                stockQuantity: parseInt(form.stockQuantity),
            };
            if (product) {
                await api.patch(`/products/${product.id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                    <span>⚠</span> {error}
                </div>
            )}

            {fields.map(({ label, key, type, placeholder }) => (
                <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        {label}
                    </label>
                    <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        min={type === 'number' ? 0 : undefined}
                        step={key === 'price' ? '0.01' : undefined}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-transparent transition-shadow"
                    />
                </div>
            ))}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-maroon-800 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-900 disabled:opacity-60 transition-colors"
                >
                    {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
