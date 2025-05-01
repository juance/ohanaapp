
// Menu types

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: any;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}
