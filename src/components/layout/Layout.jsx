import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 overflow-auto min-w-0">{children}</main>
        </div>
    );
};

export default Layout;
