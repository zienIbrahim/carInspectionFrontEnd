import { Routes } from '@angular/router';
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';
import { UserRoles } from './core/data/UserRole';
import { authGuard } from './core/Guards/auth.guard';
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
      {
        path: 'img',
        loadComponent: () => import('./core/components/image-editor/image-editor.component').then((c) => c.ImageEditorComponent)
      } ,
      // Category Routes
      { path: 'category', canActivate: [authGuard], data: { roles: [UserRoles.Admin] } , loadComponent: () => import('./pages/category/category.component').then((c) => c.CategoryComponent) },
      { path: 'category/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/category/create-category/create-category.component').then((c) => c.CreateCategoryComponent) },
      { path: 'category/edit/:id', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/category/edit-category/edit-category.component').then((c) => c.EditCategoryComponent) },

      // Package Routes
      { path: 'package', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/package/package.component').then((c) => c.PackageComponent) },
      { path: 'package/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/package/create-package/create-package.component').then((c) => c.CreatePackageComponent) },
      { path: 'package/edit/:id', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/package/edit-package/edit-package.component').then((c) => c.EditPackageComponent) },

      // Check Routes
      { path: 'check', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/check/check.component').then((c) => c.CheckComponent) },
      { path: 'check/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/check/create-check/create-check.component').then((c) => c.CreateCheckComponent) },
      { path: 'check/edit/:id', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/check/edit-check/edit-check.component').then((c) => c.EditCheckComponent) },

      // technician Routes
      { path: 'technician', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/technician/technician.component').then((c) => c.TechnicianComponent) },
      { path: 'technician/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/technician/create-technician/create-technician.component').then((c) => c.CreateTechnicianComponent) },
      { path: 'technician/edit/:id', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/technician/edit-technician/edit-technician.component').then((c) => c.EditTechnicianComponent) },
     
     
      // make Routes
      { path: 'make', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/makes/makes.component').then((c) => c.MakesComponent) },
      { path: 'make/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/makes/create-make/create-make.component').then((c) => c.CreateMakeComponent) },
      { path: 'make/edit/:id', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/makes/edit-make/edit-make.component').then((c) => c.EditMakeComponent) },

      // model Routes
      { path: 'model', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/models/models.component').then((c) => c.ModelsComponent) },
      { path: 'model/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/models/create-model/create-model.component').then((c) => c.CreateModelComponent) },
      { path: 'model/edit/:id', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/models/edit-model/edit-model.component').then((c) => c.EditModelComponent) },
      // result Routes
      { path: 'result', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/result/result.component').then((c) => c.ResultComponent) },
      { path: 'result/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/result/create-result/create-result.component').then((c) => c.CreateResultComponent) },
      { path: 'result/edit/:id', canActivate: [authGuard], data: { roles: [UserRoles.Admin] }, loadComponent: () => import('./pages/result/edit-result/edit-result.component').then((c) => c.EditResultComponent) },
      // inspection Routes
      { path: 'inspection', canActivate: [authGuard], data: { roles: [UserRoles.Admin,UserRoles.Inspector,UserRoles.Receptionist] },loadComponent: () => import('./pages/inspection/inspection.component').then((c) => c.InspectionComponent) },
      { path: 'inspection/create', canActivate: [authGuard], data: { roles: [UserRoles.Admin,UserRoles.Receptionist] },loadComponent: () => import('./pages/inspection/create-inspection/create-inspection.component').then((c) => c.CreateInspectionComponent) },
      { path: 'inspection/process/:id',canActivate: [authGuard], data: { roles: [UserRoles.Admin,UserRoles.Inspector] }, loadComponent: () => import('./pages/inspection/process-inspection/process-inspection.component').then((c) => c.ProcessInspectionComponent) },
      { path: 'inspection/details/:id',canActivate: [authGuard], data: { roles: [UserRoles.Admin,UserRoles.Inspector,UserRoles.Receptionist] }, loadComponent: () => import('./pages/inspection/inspection-details/inspection-details.component').then((c) => c.InspectionDetailsComponent) },
      { path: 'inspection/report/:id',canActivate: [authGuard], data: { roles: [UserRoles.Admin,UserRoles.Inspector,UserRoles.Receptionist] }, loadComponent: () => import('./pages/inspection/inspection-report/inspection-report.component').then((c) => c.InspectionReportComponent) },

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