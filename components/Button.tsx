export function Button({ children, className, onClick, type, id, disabled, title, ariaLabel, ariaPressed, ariaExpanded }: {
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
  type?: "button" | "submit",
  id?: string,
  disabled?: boolean,
  title?: string,
  ariaLabel?: string,
  ariaPressed?: boolean,
  ariaExpanded?: boolean
}) {
  return (
    <button onClick={onClick} type={type} id={id} disabled={disabled} title={title} aria-label={ariaLabel} aria-pressed={ariaPressed} aria-expanded={ariaExpanded} className={`cursor-pointer ${className}`}>{children}</button>
  )
}