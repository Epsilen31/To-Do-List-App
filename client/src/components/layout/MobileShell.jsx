export default function MobileShell({ children, className = '' }) {
  return (
    <div className="h-[100dvh] overflow-hidden sm:flex sm:items-center sm:justify-center sm:px-4">
      <div className={`phone-frame ${className}`}>{children}</div>
    </div>
  );
}
