"use client";

const COLORS = {
  coral: "bg-coral hover:bg-coral/90",
  mint: "bg-mint hover:bg-mint/90",
  sunny: "bg-sunny hover:bg-sunny/90",
  sky: "bg-sky hover:bg-sky/90",
  grape: "bg-grape hover:bg-grape/90",
};

export default function BigButton({
  children,
  onClick,
  type = "button",
  color = "coral",
  disabled = false,
  className = "",
  size = "md",
}) {
  const sizeClasses = size === "lg" ? "px-8 py-4 text-xl" : "px-6 py-3 text-base";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-display font-bold text-ink rounded-2xl border-2 border-ink
        shadow-chunky active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
        transition-all duration-100
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-chunky
        ${COLORS[color]} ${sizeClasses} ${className}
      `}
    >
      {children}
    </button>
  );
}
