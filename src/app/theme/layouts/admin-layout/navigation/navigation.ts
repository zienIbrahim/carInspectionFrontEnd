import { UserRoles } from "src/app/core/data/UserRole";

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
  requerdRoles?: string[];
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
        breadcrumbs: true
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
        id: 'inspection',
        title: 'navigation.inspection',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/inspection',
        icon: 'partition',
        target: false,
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'inspection.ListTitle',
            type: 'item',
            requerdRoles: [UserRoles.Admin, UserRoles.Receptionist, UserRoles.Inspector],
            classes: 'nav-item',
            url: '/inspection',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'inspection.CreateTitle',
            type: 'item',
            requerdRoles: [UserRoles.Admin, UserRoles.Receptionist],
            classes: 'nav-item',
            url: '/inspection/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
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
    requerdRoles: [UserRoles.Admin],
    children: [
      {
        id: 'category',
        title: 'navigation.category',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/category',
        icon: 'partition',
        target: false,
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'category.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/category',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'category.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/category/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
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
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'check.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/check',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'check.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/check/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
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
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'package.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/package',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'package.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/package/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
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
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'technician.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/technician',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'technician.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/technician/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
          }
        ]
      },
      {
        id: 'result',
        title: 'navigation.result',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/result',
        icon: 'setting',
        target: false,
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'result.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/result',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'result.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/result/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
          }
        ]
      },
      {
        id: 'make',
        title: 'navigation.make',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/make',
        icon: 'setting',
        target: false,
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'make.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/make',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'make.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/make/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
          }
        ]
      },
      {
        id: 'model',
        title: 'navigation.model',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/model',
        icon: 'setting',
        target: false,
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'model.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/model',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'model.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/model/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
          }
        ]
      },{
        id: 'user',
        title: 'navigation.user',
        type: 'collapse',
        classes: 'nav-item coded-hasmenu',
        url: '/user',
        icon: 'user',
        target: false,
        breadcrumbs: true,
        children:[
          {
            id: 'List',
            title: 'user.ListTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/user',
            icon: 'ordered-list',
            target: false,
            breadcrumbs: true
          },
          {
            id: 'create',
            title: 'user.CreateTitle',
            type: 'item',
            classes: 'nav-item',
            url: '/user/create',
            icon: 'plus',
            target: false,
            breadcrumbs: true
          }
        ]
      },
    ]
  }
];
