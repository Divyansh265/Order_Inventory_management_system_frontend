import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CreateOrderForm = ({ onSaved, onCancel }) => {
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/products', { params: { limit: 100 } }).then(({ data }) => {
            setProducts(data.data.products);
        });
    }, []);

    const addItem = () => setItems([...items, { productId: '', quantity: 1 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validItems = items.filter((i) => i.productId && i.quantity > 0);
        if (validItems.length === 0) {
            setError('Add at least one product to the order');
            return;
        }
        setLoading(true);
        try {
            await api.post('/orders', {
                items: validItems.map((i) => ({
                    productId: parseInt(i.productId),
                    quantity: parseInt(i.quantity),
                })),
            });
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order');
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

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                            {index === 0 && (
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Product
                                </label>
                            )}
                            <select
                                value={item.productId}
                                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-transparent bg-white"
                            >
                                <option value="">Select a product</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} — Stock: {p.stockQuantity}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-24">
                            {index === 0 && (
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Qty
                                </label>
                            )}
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-transparent"
                            />
                        </div>
                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="mb-0.5 w-8 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors text-lg"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="text-sm text-maroon-700 hover:text-maroon-900 font-medium hover:underline"
            >
                + Add another item
            </button>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-maroon-800 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-900 disabled:opacity-60 transition-colors"
                >
                    {loading ? 'Creating...' : 'Create Order'}
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

export default CreateOrderForm;
