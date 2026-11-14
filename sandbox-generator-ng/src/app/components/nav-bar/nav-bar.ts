import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {
  readonly links: NavLink[] = [
    { path: '/hex-draw', label: 'Hex Draw' },
    { path: '/hex-draw-biome-patch', label: 'Biome Patch' },
    { path: '/hex-draw-feature-patch', label: 'Feature Patch' },
    { path: '/hex-draw-faction-patch', label: 'Faction Patch' },
    { path: '/hex-draw-content-patch', label: 'Content Patch' },
    { path: '/hex-draw-patch', label: 'Sample Patch' },
    { path: '/settlements', label: 'Settlements' },
    { path: '/lairs', label: 'Lairs' },
    { path: '/dungeons', label: 'Dungeons' },
    { path: '/criminal-organization', label: 'Criminal Orgs' },
    { path: '/guild', label: 'Guilds' },
    { path: '/tavern', label: 'Taverns' },
    { path: '/encounters', label: 'Encounters' },
    { path: '/content', label: 'Landmark Content' },
  ];
}
