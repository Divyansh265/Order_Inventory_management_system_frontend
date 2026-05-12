import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';

const OrderDetail = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api
            .get(`/orders/${orderId}`)
            .then(({ data }) => setOrder(data.data))
            .catch(() => setError('Failed to load order details'))
            .finally(() => setLoading(false));
    }, [orderId]);

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;
    if (!order) return null;

    return (
        <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Order Number', value: <span className="font-mono font-medium text-gray-800">{order.orderNumber}</span> },
                    { label: 'Status', value: <Badge value={order.status} /> },
                    { label: 'Created By', value: <span className="text-gray-700">{order.createdBy?.name}</span> },
                    { label: 'Date', value: <span className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</span> },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                        {value}
                    </div>
                ))}
            </div>

            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Order Items</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-left">
                                <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                                <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Qty</th>
                                <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Unit Price</th>
                                <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.orderItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-3 font-medium text-gray-700">{item.product?.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.quantity}</td>
                                    <td className="px-4 py-3 text-gray-500">${parseFloat(item.price).toFixed(2)}</td>
                                    <td className="px-4 py-3 font-medium text-gray-700">
                                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end">
                <div className="bg-maroon-50 border border-maroon-100 rounded-xl px-5 py-3">
                    <span className="text-xs font-semibold text-maroon-600 uppercase tracking-wide mr-3">Total</span>
                    <span className="text-lg font-bold text-maroon-800">${parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
