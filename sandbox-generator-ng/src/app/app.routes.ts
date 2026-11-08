import { Routes } from '@angular/router';
import { HelloAngular } from './components/hello-angular/hello-angular';
import { LandmarkContent } from './pages/content/content';
import { Encounters } from './pages/encounters/encounters';
import { Dungeons } from './pages/dungeons/dungeons';
import { CriminalOrganizationPage } from './pages/criminal-organization/criminal-organization';
import { HexDrawPatch } from './pages/hex-draw-patch/hex-draw-patch';
import { HexPatchPage } from './pages/hex-patch-page/hex-patch-page';
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
    path: 'content',
    component: LandmarkContent
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
    path: 'hex-draw-biome-patch',
    component: HexPatchPage,
    data: { mode: 'biome' },
  },
  {
    path: 'hex-draw-feature-patch',
    component: HexPatchPage,
    data: { mode: 'feature' },
  },
  {
    path: 'hex-draw-faction-patch',
    component: HexPatchPage,
    data: { mode: 'faction' },
  },
  {
    path: 'hex-draw-content-patch',
    component: HexPatchPage,
    data: { mode: 'content' },
  },
  {
    path: 'settlements',
    component: Settlements
  },
  {
    path: 'lairs',
    component: Lairs
  },
  {
    path: 'encounters',
    component: Encounters
  },
  {
    path: 'dungeons',
    component: Dungeons
  },
  {
    path: 'criminal-organization',
    component: CriminalOrganizationPage,
  },
];
