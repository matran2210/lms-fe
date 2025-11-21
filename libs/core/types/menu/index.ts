export type MenuItem = {
  name: string;
  icon: string;
  url: string;
  type?: string;
  id: string;
  depth: number;
  subItems?: MenuItem[];
};

export type MenuOption = {
  name: string;
  icon: string;
  url: string;
  type: string;
  subItems?: MenuOption[];
};
