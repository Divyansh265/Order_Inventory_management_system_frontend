import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import ProductForm from './ProductForm';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../components/common/Alert';

const Products = () => {
    const { user } = useAuth();
    const { showAlert, showConfirm } = useAlert();
    const isAdmin = user?.role === 'admin';

    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [error, setError] = useState('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (search) params.search = search;
            const { data } = await api.get('/products', { params });
            setProducts(data.data.products);
            setMeta(data.data.meta);
        } catch {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleDelete = (id, name) => {
        showConfirm({
            title: 'Delete Product',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    await api.delete(`/products/${id}`);
                    showAlert({ type: 'success', title: 'Deleted', message: 'Product deleted successfully.' });
                    fetchProducts();
                } catch (err) {
                    showAlert({ type: 'error', title: 'Delete Failed', message: err.response?.data?.message || 'Could not delete product.' });
                }
            },
        });
    };

    const handleSaved = () => {
        setModal(null);
        fetchProducts();
    };

    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Products</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your product catalog</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setModal('create')}
                        className="bg-maroon-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-maroon-900 transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Add Product
                    </button>
                )}
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search products by name..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-transparent bg-white"
                />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <Spinner />
                ) : products.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-sm">No products found.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-left">
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">SKU</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                                {isAdmin && <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400 bg-gray-50/50">{p.sku}</td>
                                    <td className="px-5 py-3.5 text-gray-700">${parseFloat(p.price).toFixed(2)}</td>
                                    <td className="px-5 py-3.5">
                                        {p.stockQuantity <= 10 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                {p.stockQuantity} low
                                            </span>
                                        ) : (
                                            <span className="text-gray-700">{p.stockQuantity}</span>
                                        )}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setModal({ product: p })}
                                                    className="text-xs font-medium text-maroon-700 hover:text-maroon-900 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <span className="text-gray-200">|</span>
                                                <button
                                                    onClick={() => handleDelete(p.id, p.name)}
                                                    className="text-xs font-medium text-gray-400 hover:text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination meta={meta} onPageChange={setPage} />

            {modal && (
                <Modal
                    title={modal === 'create' ? 'Add New Product' : 'Edit Product'}
                    onClose={() => setModal(null)}
                >
                    <ProductForm product={modal?.product} onSaved={handleSaved} onCancel={() => setModal(null)} />
                </Modal>
            )}
        </Layout>
    );
};

export default Products;
