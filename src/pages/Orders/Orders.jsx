import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import CreateOrderForm from './CreateOrderForm';
import OrderDetail from './OrderDetail';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../components/common/Alert';

const Orders = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const isAdmin = user?.role === 'admin';

    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [error, setError] = useState('');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (statusFilter) params.status = statusFilter;
            const { data } = await api.get('/orders', { params });
            setOrders(data.data.orders);
            setMeta(data.data.meta);
        } catch {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            showAlert({
                type: 'success',
                title: 'Status Updated',
                message: `Order marked as ${status}.`,
            });
            fetchOrders();
        } catch (err) {
            showAlert({
                type: 'error',
                title: 'Update Failed',
                message: err.response?.data?.message || 'Could not update order status.',
            });
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Orders</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Track and manage customer orders</p>
                </div>
                <button
                    onClick={() => setModal('create')}
                    className="bg-maroon-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-maroon-900 transition-colors flex items-center gap-2"
                >
                    <span>+</span> Create Order
                </button>
            </div>

            <div className="mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-transparent bg-white"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <Spinner />
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-sm">No orders found.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-left">
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order #</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Created By</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{o.orderNumber}</td>
                                    <td className="px-5 py-3.5"><Badge value={o.status} /></td>
                                    <td className="px-5 py-3.5 font-medium text-gray-800">${parseFloat(o.totalAmount).toFixed(2)}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{o.createdBy?.name}</td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setModal({ order: o })}
                                                className="text-xs font-medium text-maroon-700 hover:text-maroon-900 hover:underline"
                                            >
                                                View
                                            </button>
                                            {isAdmin && o.status === 'pending' && (
                                                <>
                                                    <span className="text-gray-200">|</span>
                                                    <button
                                                        onClick={() => handleStatusUpdate(o.id, 'completed')}
                                                        className="text-xs font-medium text-green-600 hover:text-green-800 hover:underline"
                                                    >
                                                        Complete
                                                    </button>
                                                    <span className="text-gray-200">|</span>
                                                    <button
                                                        onClick={() => handleStatusUpdate(o.id, 'cancelled')}
                                                        className="text-xs font-medium text-gray-400 hover:text-red-600 hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination meta={meta} onPageChange={setPage} />

            {modal === 'create' && (
                <Modal title="Create New Order" onClose={() => setModal(null)}>
                    <CreateOrderForm
                        onSaved={() => { setModal(null); fetchOrders(); }}
                        onCancel={() => setModal(null)}
                    />
                </Modal>
            )}

            {modal?.order && (
                <Modal title={`Order — ${modal.order.orderNumber}`} onClose={() => setModal(null)}>
                    <OrderDetail orderId={modal.order.id} />
                </Modal>
            )}
        </Layout>
    );
};

export default Orders;
