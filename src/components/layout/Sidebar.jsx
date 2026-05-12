import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '▦' },
    { to: '/products', label: 'Products', icon: '⊞' },
    { to: '/orders', label: 'Orders', icon: '≡' },
    { to: '/profile', label: 'Profile', icon: '◯' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-60 bg-maroon-800 text-white flex flex-col min-h-screen shrink-0">
            <div className="px-6 py-5 border-b border-maroon-700">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">
                        IM
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight">Inventory Manager</p>
                        <p className="text-xs text-maroon-300 mt-0.5">{user?.role?.toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                ? 'bg-white/15 text-white font-medium'
                                : 'text-maroon-200 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-base w-5 text-center">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 py-4 border-t border-maroon-700">
                <div className="px-3 mb-2">
                    <p className="text-xs text-maroon-300 truncate">{user?.name}</p>
                    <p className="text-xs text-maroon-400 truncate">{user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-maroon-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <span className="text-base w-5 text-center">↩</span>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
