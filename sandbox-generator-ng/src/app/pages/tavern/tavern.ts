import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  calcTavern,
  rollTavernDrink,
  type Tavern,
  type TavernDrink,
} from '../../../data/tavern';

@Component({
  selector: 'app-tavern',
  imports: [],
  templateUrl: './tavern.html',
  styleUrl: './tavern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TavernPage {
  readonly includeSecondServerTrait = signal(false);
  readonly tavern = signal<Tavern>(calcTavern());
  readonly drink = signal<TavernDrink | null>(null);

  onIncludeSecondServerTraitChange(event: Event): void {
    this.includeSecondServerTrait.set((event.target as HTMLInputElement).checked);
  }

  onGenerate(): void {
    this.tavern.set(calcTavern({ includeSecondServerTrait: this.includeSecondServerTrait() }));
    this.drink.set(null);
  }

  onRollDrink(): void {
    this.drink.set(rollTavernDrink());
  }
}
