import React from 'react';

interface SheffieldLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'white';
  showText?: boolean;
  subText?: string;
}

export const SheffieldLogo: React.FC<SheffieldLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showText = true,
  subText = 'City Council',
}) => {
  const iconSizes = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 52, height: 52 },
  };

  const currentSize = iconSizes[size];

  // Official Sheffield City Council Green
  const sheffieldGreen = '#005A36';
  const textColor = variant === 'white' ? '#FFFFFF' : '#102C50';
  const subTextColor = variant === 'white' ? '#A3C8B7' : '#5C748D';

  return (
    <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Official Sheffield City Council Municipal Crest / Insignia */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,90,54,0.15)' }}
        aria-label="Sheffield City Council Crest"
      >
        {/* Shield background with Sheffield Council Forest Green */}
        <path
          d="M10 16C10 12.6863 12.6863 10 16 10H84C87.3137 10 90 12.6863 90 16V52C90 73.5391 73.5391 90 52 90H48C26.4609 90 10 73.5391 10 52V16Z"
          fill={sheffieldGreen}
        />
        {/* Inner heraldic border */}
        <path
          d="M16 18C16 15.7909 17.7909 14 20 14H80C82.2091 14 84 15.7909 84 18V50C84 69.8823 68.8823 85 50 85C31.1177 85 16 69.8823 16 50V18Z"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Heraldic Sheaf of Eight Arrows (Sheffield's historic cutlery & steel heritage symbol) */}
        {/* Central crossed arrows */}
        <line x1="28" y1="70" x2="72" y2="28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="70" x2="28" y2="28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="24" x2="50" y2="74" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="49" x2="76" y2="49" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

        {/* Arrowheads */}
        <path d="M50 20L45 30H55L50 20Z" fill="#F4D03F" />
        <path d="M74 26L64 28L70 34L74 26Z" fill="#F4D03F" />
        <path d="M26 26L30 34L36 28L26 26Z" fill="#F4D03F" />
        <path d="M78 49L68 44V54L78 49Z" fill="#F4D03F" />
        <path d="M22 49L32 54V44L22 49Z" fill="#F4D03F" />

        {/* Arrow fletchings at bottom */}
        <path d="M47 70L50 78L53 70H47Z" fill="#F4D03F" />
        <path d="M68 64L74 72L66 70L68 64Z" fill="#F4D03F" />
        <path d="M32 64L34 70L26 72L32 64Z" fill="#F4D03F" />

        {/* Central Sheaf Band (The Garb / Binding) */}
        <ellipse cx="50" cy="49" rx="10" ry="7" fill="#E67E22" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="50" cy="49" r="3" fill="#FFFFFF" />

        {/* Golden wheat garbs / coronet accents */}
        <circle cx="50" cy="38" r="2.5" fill="#F4D03F" />
        <circle cx="43" cy="42" r="2" fill="#F4D03F" />
        <circle cx="57" cy="42" r="2" fill="#F4D03F" />
      </svg>

      {showText && (
        <div style={{ lineHeight: 1.2 }}>
          <strong
            style={{
              display: 'block',
              fontSize: size === 'lg' ? 19 : size === 'md' ? 15 : 13,
              fontWeight: 800,
              color: textColor,
              fontFamily: "Manrope, 'DM Sans', sans-serif",
              letterSpacing: '-0.03em',
            }}
          >
            Sheffield City Council
          </strong>
          <span
            style={{
              display: 'block',
              fontSize: size === 'lg' ? 12 : 11,
              fontWeight: 600,
              color: subTextColor,
              marginTop: 2,
              letterSpacing: '0.02em',
            }}
          >
            {subText}
          </span>
        </div>
      )}
    </div>
  );
};
