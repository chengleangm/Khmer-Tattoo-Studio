type WhatsAppIconProps = {
  size?: number;
  className?: string;
};

export default function WhatsAppIcon({ size = 18, className }: WhatsAppIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      focusable="false"
    >
      <path d="M4.4 19.6 5.7 16A8 8 0 1 1 8 18.3l-3.6 1.3Z" />
      <path d="M8.7 8.7c.2-.5.4-.6.7-.6h.5c.2 0 .4.1.5.4l.6 1.5c.1.3 0 .5-.2.7l-.4.5c.7 1.3 1.6 2.2 2.9 2.9l.5-.4c.2-.2.5-.3.8-.1l1.4.6c.3.1.5.3.5.6v.5c0 .3-.1.6-.6.8-.5.2-1.3.4-2.3.1-2.8-.8-5-3-5.8-5.8-.3-1-.1-1.8.1-2.3Z" />
    </svg>
  );
}
