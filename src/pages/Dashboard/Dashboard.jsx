import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import api from '../../api/axios';

const StatCard = ({ label, value, icon, accent }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${accent}`}>{icon}</span>
        </div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api
            .get('/dashboard/stats')
            .then(({ data }) => setStats(data.data))
            .catch(() => setError('Failed to load dashboard stats'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-sm text-gray-500 mt-0.5">Overview of your inventory and orders</p>
            </div>

            {loading && <Spinner />}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
            )}

            {stats && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard label="Total Products" value={stats.totalProducts} icon="📦" accent="bg-maroon-50" />
                        <StatCard label="Total Orders" value={stats.totalOrders} icon="🛒" accent="bg-gray-50" />
                        <StatCard label="Low Stock" value={stats.lowStockProducts.length} icon="⚠️" accent="bg-amber-50" />
                        <StatCard label="Recent Orders" value={stats.recentOrders.length} icon="📋" accent="bg-gray-50" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-5 bg-maroon-800 rounded-full"></span>
                                <h3 className="font-semibold text-gray-700 text-sm">Low Stock Products</h3>
                            </div>
                            {stats.lowStockProducts.length === 0 ? (
                                <p className="text-sm text-gray-400 py-4 text-center">All products are well stocked.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-gray-100">
                                            <th className="pb-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                                            <th className="pb-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">SKU</th>
                                            <th className="pb-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.lowStockProducts.map((p) => (
                                            <tr key={p.id} className="border-b border-gray-50 last:border-0">
                                                <td className="py-2.5 font-medium text-gray-700">{p.name}</td>
                                                <td className="py-2.5 text-gray-400 font-mono text-xs">{p.sku}</td>
                                                <td className="py-2.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                        {p.stockQuantity}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-5 bg-maroon-800 rounded-full"></span>
                                <h3 className="font-semibold text-gray-700 text-sm">Recent Orders</h3>
                            </div>
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-sm text-gray-400 py-4 text-center">No orders yet.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-gray-100">
                                            <th className="pb-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order #</th>
                                            <th className="pb-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                                            <th className="pb-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map((o) => (
                                            <tr key={o.id} className="border-b border-gray-50 last:border-0">
                                                <td className="py-2.5 font-mono text-xs text-gray-500">{o.orderNumber}</td>
                                                <td className="py-2.5"><Badge value={o.status} /></td>
                                                <td className="py-2.5 font-medium text-gray-700">${parseFloat(o.totalAmount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default Dashboard;
