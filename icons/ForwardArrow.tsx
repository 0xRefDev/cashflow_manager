export function ForwardArrow(props: React.SVGProps<SVGSVGElement>) {
  return (<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    {...props}
    className="w-[1.1em] transition-transform duration-300 text-[#042b17] group-hover:translate-x-[0.1em]"
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path
      fill="currentColor"
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
    ></path>
  </svg>);
}