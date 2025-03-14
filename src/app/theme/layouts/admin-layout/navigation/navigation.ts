export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'navigation.dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'navigation.dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/home',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'inspection',
    title: 'navigation.inspection',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'category',
        title: 'navigation.inspection',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/inspection',
        icon: 'partition',
        target: false,
        breadcrumbs: false,
        children:[
          {
            id: 'List',
            title: 'navigation.List',
            type: 'item',
            classes: 'nav-item',
            url: '/inspection',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'create',
            title: 'navigation.create',
            type: 'item',
            classes: 'nav-item',
            url: '/inspection/create',
            icon: 'plus',
            target: false,
            breadcrumbs: false
          }
        ]
      },
    ]
  },
  {
    id: 'system',
    title: 'navigation.system',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'category',
        title: 'navigation.category',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/category',
        icon: 'partition',
        target: false,
        breadcrumbs: false,
        children:[
          {
            id: 'List',
            title: 'navigation.List',
            type: 'item',
            classes: 'nav-item',
            url: '/category',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'create',
            title: 'navigation.create',
            type: 'item',
            classes: 'nav-item',
            url: '/category/create',
            icon: 'plus',
            target: false,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'check',
        title: 'navigation.check',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/check',
        icon: 'schedule',
        target: false,
        breadcrumbs: false,
        children:[
          {
            id: 'List',
            title: 'navigation.List',
            type: 'item',
            classes: 'nav-item',
            url: '/check',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'create',
            title: 'navigation.create',
            type: 'item',
            classes: 'nav-item',
            url: '/check/create',
            icon: 'plus',
            target: false,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'package',
        title: 'navigation.package',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/package',
        icon: 'profile',
        target: false,
        breadcrumbs: false,
        children:[
          {
            id: 'List',
            title: 'navigation.List',
            type: 'item',
            classes: 'nav-item',
            url: '/package',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'create',
            title: 'navigation.create',
            type: 'item',
            classes: 'nav-item',
            url: '/package/create',
            icon: 'plus',
            target: false,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'technician',
        title: 'navigation.technician',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/technician',
        icon: 'user',
        target: false,
        breadcrumbs: false,
        children:[
          {
            id: 'List',
            title: 'navigation.List',
            type: 'item',
            classes: 'nav-item',
            url: '/technician',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'create',
            title: 'navigation.create',
            type: 'item',
            classes: 'nav-item',
            url: '/technician/create',
            icon: 'plus',
            target: false,
            breadcrumbs: false
          }
        ]
      },
    ]
  }
];
