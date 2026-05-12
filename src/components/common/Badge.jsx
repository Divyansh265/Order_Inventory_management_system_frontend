const colors = {
    pending: 'bg-amber-100 text-amber-800 border border-amber-200',
    completed: 'bg-green-100 text-green-800 border border-green-200',
    cancelled: 'bg-gray-100 text-gray-600 border border-gray-200',
    admin: 'bg-maroon-100 text-maroon-800 border border-maroon-200',
    staff: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const Badge = ({ value }) => {
    const style = colors[value] || 'bg-gray-100 text-gray-700 border border-gray-200';
    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {value}
        </span>
    );
};

export default Badge;
