const StatCard = ({ icon: Icon, label, value, color = 'primary', trend }) => {
  const colorMap = {
    primary: { bg: 'bg-primary-50', icon: 'bg-primary-600 text-white', text: 'text-primary-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-500 text-white', text: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500 text-white', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-500 text-white', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500 text-white', text: 'text-purple-600' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={`card flex items-center gap-4 hover:shadow-soft transition-shadow`}>
      <div className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
        <Icon className="text-xl" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
