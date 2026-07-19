export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-3xl border-2 border-ink shadow-chunky p-6 ${className}`}
    >
      {children}
    </div>
  );
}
