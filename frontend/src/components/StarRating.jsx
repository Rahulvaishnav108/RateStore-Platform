import { useState } from 'react';

const StarIcon = ({ filled, size }) => {
  const sizes = { sm: 14, md: 20, lg: 30 };
  const px = sizes[size] || 20;
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill={filled ? '#fbbf24' : 'none'}
      stroke={filled ? '#fbbf24' : '#cbd5e1'} strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        strokeLinejoin="round" />
    </svg>
  );
};

const StarRating = ({ value = 0, onChange, size = 'md', readonly = false, showValue = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-transform duration-100 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            style={{ background: 'none', border: 'none', padding: '1px' }}
          >
            <StarIcon filled={filled} size={size} />
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ml-1 text-sm font-semibold text-slate-600">{Number(value).toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
