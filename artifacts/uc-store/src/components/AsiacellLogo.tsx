export function AsiacellLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#E30613" stroke="#fff" strokeWidth="2"/>
      <path d="M30 65 Q50 25 70 65" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="35" r="5" fill="#fff"/>
      <path d="M25 72 h50" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
