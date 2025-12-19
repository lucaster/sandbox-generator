import { Routes } from '@angular/router';
import { HelloAngular } from './components/hello-angular/hello-angular';
import { Page1 } from './pages/page1/page1';
import { Honeycomb } from './pages/honeycomb/honeycomb';
import { HoneycombSvg } from './pages/honeycomb-svg/honeycomb-svg';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/page1',
  },
  {
    path: 'hello-angular',
    component: HelloAngular
  },
  {
    path: 'page1',
    component: Page1
  },
  {
    path: 'honeycomb',
    component: Honeycomb
  },
  {
    path: 'honeycomb-svg',
    component: HoneycombSvg
  },
];
