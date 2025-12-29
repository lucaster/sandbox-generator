import { Routes } from '@angular/router';
import { HelloAngular } from './components/hello-angular/hello-angular';
import { HexDrawPatch } from './pages/hex-draw-patch/hex-draw-patch';
import { HexDraw } from './pages/hex-draw/hex-draw';
import { Lairs } from './pages/lairs/lairs';
import { Page1 } from './pages/page1/page1';
import { Settlements } from './pages/settlements/settlements';
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
    path: 'hex-draw',
    component: HexDraw
  },
  {
    path: 'hex-draw-patch',
    component: HexDrawPatch
  },
  {
    path: 'settlements',
    component: Settlements
  },
  {
    path: 'lairs',
    component: Lairs
  },
];
