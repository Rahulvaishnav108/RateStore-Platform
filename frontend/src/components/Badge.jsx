const variants = {
  admin:       'bg-purple-100 text-purple-700 border-purple-200',
  user:        'bg-blue-100 text-blue-700 border-blue-200',
  store_owner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  success:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning:     'bg-amber-100 text-amber-700 border-amber-200',
  danger:      'bg-red-100 text-red-700 border-red-200',
  info:        'bg-blue-100 text-blue-700 border-blue-200',
  default:     'bg-slate-100 text-slate-700 border-slate-200',
};

const roleLabels = { admin: 'Admin', user: 'User', store_owner: 'Store Owner' };

const Badge = ({ variant = 'default', children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.default} ${className}`}>
    {roleLabels[children] || children}
  </span>
);

export default Badge;
