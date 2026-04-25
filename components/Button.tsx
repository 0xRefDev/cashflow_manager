export function Button ({ children, className, onClick, type, id, disabled }: { children: React.ReactNode, className?: string, onClick?: () => void, type?: "button" | "submit", id?: string, disabled?: boolean }) {
  return (
    <button onClick={onClick} type={type} id={id} disabled={disabled} className={`cursor-pointer ${className}`}>{children}</button>
  )
}