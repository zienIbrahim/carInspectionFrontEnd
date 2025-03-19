import { Routes } from '@angular/router';
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./dashboard/dashboard.component').then((c) => c.DashboardComponent)
      } ,
      // Category Routes
      { path: 'category', loadComponent: () => import('./pages/category/category.component').then((c) => c.CategoryComponent) },
      { path: 'category/create', loadComponent: () => import('./pages/category/create-category/create-category.component').then((c) => c.CreateCategoryComponent) },
      { path: 'category/edit/:id', loadComponent: () => import('./pages/category/edit-category/edit-category.component').then((c) => c.EditCategoryComponent) },

      // Package Routes
      { path: 'package', loadComponent: () => import('./pages/package/package.component').then((c) => c.PackageComponent) },
      { path: 'package/create', loadComponent: () => import('./pages/package/create-package/create-package.component').then((c) => c.CreatePackageComponent) },
      { path: 'package/edit/:id', loadComponent: () => import('./pages/package/edit-package/edit-package.component').then((c) => c.EditPackageComponent) },

      // Check Routes
      { path: 'check', loadComponent: () => import('./pages/check/check.component').then((c) => c.CheckComponent) },
      { path: 'check/create', loadComponent: () => import('./pages/check/create-check/create-check.component').then((c) => c.CreateCheckComponent) },
      { path: 'check/edit/:id', loadComponent: () => import('./pages/check/edit-check/edit-check.component').then((c) => c.EditCheckComponent) },

      // technician Routes
      { path: 'technician', loadComponent: () => import('./pages/technician/technician.component').then((c) => c.TechnicianComponent) },
      { path: 'technician/create', loadComponent: () => import('./pages/technician/create-technician/create-technician.component').then((c) => c.CreateTechnicianComponent) },
      { path: 'technician/edit/:id', loadComponent: () => import('./pages/technician/edit-technician/edit-technician.component').then((c) => c.EditTechnicianComponent) },


      // inspection Routes
      { path: 'inspection', loadComponent: () => import('./pages/inspection/inspection.component').then((c) => c.InspectionComponent) },
      { path: 'inspection/create', loadComponent: () => import('./pages/inspection/create-inspection/create-inspection.component').then((c) => c.CreateInspectionComponent) },
      { path: 'inspection/process/:id', loadComponent: () => import('./pages/inspection/process-inspection/process-inspection.component').then((c) => c.ProcessInspectionComponent) },
      { path: 'inspection/details/:id', loadComponent: () => import('./pages/inspection/inspection-details/inspection-details.component').then((c) => c.InspectionDetailsComponent) },
      { path: 'inspection/report/:id', loadComponent: () => import('./pages/inspection/inspection-report/inspection-report.component').then((c) => c.InspectionReportComponent) },

    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'auth/login',
        loadComponent: () => import('./pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      }
    ]
  }
];