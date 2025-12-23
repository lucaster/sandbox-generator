import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { calcHamlet, calcVillage } from '../../../data/settlements';

@Component({
  selector: 'app-settlements',
  imports: [JsonPipe],
  templateUrl: './settlements.html',
  styleUrl: './settlements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settlements {

  hamlet?: ReturnType<typeof calcHamlet>;
  village?: ReturnType<typeof calcVillage>;

  onCalcHamlet() {
    this.hamlet = calcHamlet();
  }

  onCalcVillage() {
    this.village = calcVillage();
  }
}
