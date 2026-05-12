import Layout from '../../components/layout/Layout';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Profile</h2>
                <p className="text-sm text-gray-500 mt-0.5">Your account details</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-xl bg-maroon-800 flex items-center justify-center text-xl font-bold text-white shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-base">{user?.name}</p>
                        <div className="mt-1">
                            <Badge value={user?.role} />
                        </div>
                    </div>
                </div>

                <div className="space-y-0">
                    {[
                        { label: 'Email Address', value: user?.email },
                        { label: 'Role', value: <span className="capitalize">{user?.role}</span> },
                        { label: 'User ID', value: `#${user?.id}` },
                    ].map(({ label, value }, i, arr) => (
                        <div
                            key={label}
                            className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
                            <span className="text-sm font-medium text-gray-700">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
