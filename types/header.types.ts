export interface MainHeaderProps {
  title: string | React.ReactElement;
  options: HeaderOption[];
  anchor?: React.ReactNode;
}

export interface HeaderOption {
  label: React.ReactNode;
  action: () => void | string;
}