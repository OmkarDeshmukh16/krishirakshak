// Shared UI Components for KrishiRakshak

// ─── StatCard ───────────────────────────────────────────────
export function StatCard({ title, value, subtitle, icon: Icon, color = 'green', trend, className = '' }) {
  const colorMap = {
    green: 'from-green-50 to-emerald-50 border-green-100',
    blue: 'from-blue-50 to-sky-50 border-blue-100',
    amber: 'from-amber-50 to-yellow-50 border-amber-100',
    red: 'from-red-50 to-rose-50 border-red-100',
    purple: 'from-purple-50 to-violet-50 border-purple-100',
  };
  const iconColorMap = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color] || colorMap.green} border rounded-2xl p-5 card-hover ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 font-display">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend.up ? 'text-green-600' : 'text-red-500'}`}>
              {trend.up ? '↑' : '↓'} {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${iconColorMap[color] || iconColorMap.green} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5.5 h-5.5" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RiskBadge ───────────────────────────────────────────────
export function RiskBadge({ level, className = '' }) {
  const map = {
    low: 'risk-low',
    moderate: 'risk-moderate',
    high: 'risk-high',
    critical: 'risk-critical',
  };
  const labels = { low: 'Low Risk', moderate: 'Moderate Risk', high: 'High Risk', critical: 'Critical' };
  const key = level?.toLowerCase() || 'low';

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${map[key] || map.low} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
      {labels[key] || level}
    </span>
  );
}

// ─── HealthScore ──────────────────────────────────────────────
export function HealthScore({ score, size = 80 }) {
  const radius = (size - 12) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="health-ring transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-800" style={{ fontSize: size * 0.22 }}>{score}</span>
        <span className="text-gray-400" style={{ fontSize: size * 0.12 }}>/100</span>
      </div>
    </div>
  );
}

// ─── LoadingSkeleton ──────────────────────────────────────────
export function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 rounded ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-8 w-1/3" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <p className="text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase">{breadcrumb}</p>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-display">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

// ─── ChartCard ───────────────────────────────────────────────
export function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-bounce-in`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 font-display">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', className = '', loading = false, ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-green-700 border border-green-200 hover:bg-green-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
    ghost: 'text-gray-600 hover:bg-gray-100',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`font-medium transition-all duration-200 flex items-center gap-2 justify-center ${variants[variant]} ${sizes[size]} ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── WeatherCard ──────────────────────────────────────────────
export function WeatherCard({ data }) {
  const conditionEmoji = (c) => {
    if (!c) return '☁️';
    const l = c.toLowerCase();
    if (l.includes('sunny') || l.includes('clear')) return '☀️';
    if (l.includes('heavy rain')) return '⛈️';
    if (l.includes('rain')) return '🌧️';
    if (l.includes('cloud')) return '⛅';
    return '🌤️';
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-sky-500 text-white rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-blue-100 text-xs font-medium">Current Weather</p>
          <p className="text-sm font-semibold text-white/90 mt-0.5">{data?.location}</p>
        </div>
        <span className="text-3xl">{conditionEmoji(data?.condition)}</span>
      </div>
      <div className="flex items-end gap-2 mb-4">
        <span className="text-5xl font-bold font-display">{data?.temp}°</span>
        <span className="text-blue-200 text-sm mb-1">C · Feels {data?.feelsLike}°C</span>
      </div>
      <p className="text-blue-100 text-sm mb-4">{data?.condition}</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/15 rounded-xl px-3 py-2">
          <p className="text-blue-200 text-xs">Humidity</p>
          <p className="font-bold text-sm">{data?.humidity}%</p>
        </div>
        <div className="bg-white/15 rounded-xl px-3 py-2">
          <p className="text-blue-200 text-xs">Rainfall</p>
          <p className="font-bold text-sm">{data?.rainfall}mm</p>
        </div>
        <div className="bg-white/15 rounded-xl px-3 py-2">
          <p className="text-blue-200 text-xs">Wind</p>
          <p className="font-bold text-sm">{data?.windSpeed} km/h</p>
        </div>
        <div className="bg-white/15 rounded-xl px-3 py-2">
          <p className="text-blue-200 text-xs">UV Index</p>
          <p className="font-bold text-sm">{data?.uvIndex}</p>
        </div>
      </div>
    </div>
  );
}

// ─── AlertCard ───────────────────────────────────────────────
export function AlertCard({ type, title, message, date }) {
  const types = {
    red: { border: 'border-l-red-500', bg: 'bg-red-50', icon: '🔴' },
    yellow: { border: 'border-l-amber-500', bg: 'bg-amber-50', icon: '🟡' },
    green: { border: 'border-l-green-500', bg: 'bg-green-50', icon: '🟢' },
    blue: { border: 'border-l-blue-500', bg: 'bg-blue-50', icon: 'ℹ️' },
    orange: { border: 'border-l-orange-500', bg: 'bg-orange-50', icon: '🟠' },
  };
  const cfg = types[type] || types.blue;

  return (
    <div className={`border-l-4 ${cfg.border} ${cfg.bg} rounded-r-xl p-4`}>
      <div className="flex items-start gap-2">
        <span>{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{title}</p>
          <p className="text-gray-600 text-xs mt-0.5">{message}</p>
          {date && <p className="text-gray-400 text-xs mt-1">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── DataTable ───────────────────────────────────────────────
export function DataTable({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full responsive-table">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} data-label={col.label} className="py-3 px-4 text-sm text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    pending: 'bg-gray-100 text-gray-600',
    under_review: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    confirmed: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-600',
  };
  const labels = {
    pending: 'Pending',
    under_review: 'Under Review',
    completed: 'Completed',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || map.pending}`}>
      {labels[status] || status}
    </span>
  );
}
