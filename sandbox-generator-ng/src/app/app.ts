import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GithubIconComponent } from './components/github-icon/github-icon.component';
import { TwitterIcon } from './components/twitter-icon/twitter-icon';
import { YoutubeIcon } from './components/youtube-icon/youtube-icon';
import { AngularLogo } from './components/angular-logo/angular-logo';
import { ExtLinkIcon } from './components/ext-link-icon/ext-link-icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GithubIconComponent, TwitterIcon, YoutubeIcon, AngularLogo, ExtLinkIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected readonly title = signal('sandbox-generator-ng');

  public readonly links = [
    { title: 'Explore the Docs', link: 'https://angular.dev' },
    { title: 'Learn with Tutorials', link: 'https://angular.dev/tutorials' },
    { title: 'Prompt and best practices for AI', link: 'https://angular.dev/ai/develop-with-ai'},
    { title: 'CLI Docs', link: 'https://angular.dev/tools/cli' },
    { title: 'Angular Language Service', link: 'https://angular.dev/tools/language-service' },
    { title: 'Angular DevTools', link: 'https://angular.dev/tools/devtools' },
  ];
}
