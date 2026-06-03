// References: Swiss Franc (CHF) - ISO 4217, flag 🇨🇭, symbol Fr
export function CHF(props: React.SVGProps<SVGSVGElement>) {
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
      <text
        x="16"
        y="21"
        fill="#fff"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
      >
        Fr
      </text>
    </svg>
  );
}