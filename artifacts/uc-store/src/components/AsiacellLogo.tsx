export function AsiacellLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="asiamax-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#D4AF37'}} />
          <stop offset="100%" style={{stopColor: '#F5D060'}} />
        </linearGradient>
        <linearGradient id="asiamax-red" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#E30613'}} />
          <stop offset="100%" style={{stopColor: '#FF2A2A'}} />
        </linearGradient>
      </defs>
      <text x="0" y="34" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="40" fill="white" letterSpacing="3">
        ASIA
      </text>
      <text x="118" y="34" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="40" fill="url(#asiamax-gold)" letterSpacing="3">
        MAX
      </text>
      <rect x="0" y="40" width="220" height="3" rx="1.5" fill="url(#asiamax-red)" opacity="0.9" />
      <rect x="0" y="40" width="120" height="3" rx="1.5" fill="url(#asiamax-gold)" opacity="0.7" />
    </svg>
  );
}
