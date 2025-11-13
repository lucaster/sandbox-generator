import { Routes } from '@angular/router';
import { Page1 } from './pages/page1/page1';
import { HelloAngular } from './components/hello-angular/hello-angular';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/hello-angular',
  },
  {
    path: 'hello-angular',
    component: HelloAngular
  },
  {
    path: 'page1',
    component: Page1
  },
];
