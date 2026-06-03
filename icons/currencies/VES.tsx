// References: Venezuelan Bolívar (VES) - ISO 4217, flag 🇻🇪, symbol Bs
export function VES(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16m0-26c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10"
      />
      <path fill="#fff" d="M14 8h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z" />
    </svg>
  );
}