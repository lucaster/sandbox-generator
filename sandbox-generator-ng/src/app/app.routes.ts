import { Routes } from '@angular/router';
import { HelloAngular } from './components/hello-angular/hello-angular';
import { HexDraw } from './pages/hex-draw/hex-draw';
import { HoneycombSvg } from './pages/honeycomb-svg/honeycomb-svg';
import { Honeycomb } from './pages/honeycomb/honeycomb';
import { Page1 } from './pages/page1/page1';
import { Summary } from './pages/summary/summary';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/summary',
  },
  {
    path: 'summary',
    component: Summary
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
  {
    path: 'hex-draw',
    component: HexDraw
  },
];
