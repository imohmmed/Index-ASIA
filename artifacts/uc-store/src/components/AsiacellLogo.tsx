export function AsiacellLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <img
      src={import.meta.env.BASE_URL + "asiacell-logo.png"}
      alt="Asiacell"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
