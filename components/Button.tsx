export function Button ({ children, className, onClick, type, id }: { children: React.ReactNode, className?: string, onClick?: () => void, type?: "button" | "submit", id?: string }) {
  return (
    <button onClick={onClick} type={type} id={id} className={`cursor-pointer ${className}`}>{children}</button>
  )
}