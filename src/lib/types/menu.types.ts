
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles?: string[];
  children?: MenuItem[];
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export interface MenuProps {
  sections: MenuSection[];
}
