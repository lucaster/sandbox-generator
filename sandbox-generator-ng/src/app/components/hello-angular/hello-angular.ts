import { Component, signal } from '@angular/core';
import { YoutubeIcon } from '../youtube-icon/youtube-icon';
import { TwitterIcon } from '../twitter-icon/twitter-icon';
import { AngularLogo } from '../angular-logo/angular-logo';
import { ExtLinkIcon } from '../ext-link-icon/ext-link-icon';
import { GithubIconComponent } from '../github-icon/github-icon.component';

@Component({
  selector: 'app-hello-angular',
  imports: [
    GithubIconComponent,
    TwitterIcon,
    YoutubeIcon,
    AngularLogo,
    ExtLinkIcon,
  ],
  templateUrl: './hello-angular.html',
  styleUrl: './hello-angular.scss',
})
export class HelloAngular {

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
