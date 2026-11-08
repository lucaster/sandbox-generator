import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { calcGuild, type Guild } from '../../../data/guild';

@Component({
  selector: 'app-guild',
  imports: [],
  templateUrl: './guild.html',
  styleUrl: './guild.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildPage {
  readonly nameField = signal('');
  readonly guild = signal<Guild>(calcGuild());

  onNameFieldInput(event: Event): void {
    this.nameField.set((event.target as HTMLInputElement).value);
  }

  onGenerate(): void {
    this.guild.set(calcGuild({ nameField: this.nameField() }));
  }
}
