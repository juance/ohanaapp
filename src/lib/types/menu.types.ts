
export interface MenuItem {
  id: string;
  title: string;
  href: string;
  icon?: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  badge?: string | number;
  roles?: string[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface SidebarConfig {
  sections: MenuSection[];
}
