import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  calcCriminalOrganization,
  type CriminalOrganization,
} from '../../../data/criminal-organization';

@Component({
  selector: 'app-criminal-organization',
  imports: [],
  templateUrl: './criminal-organization.html',
  styleUrl: './criminal-organization.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriminalOrganizationPage {
  readonly fittingName = signal('');
  readonly organization = signal<CriminalOrganization>(calcCriminalOrganization());

  onFittingNameInput(event: Event): void {
    this.fittingName.set((event.target as HTMLInputElement).value);
  }

  onGenerate(): void {
    this.organization.set(
      calcCriminalOrganization({ fittingName: this.fittingName() }),
    );
  }
}
