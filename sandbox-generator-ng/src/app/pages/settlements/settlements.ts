import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { calcHamlet, calcVillage } from '../../../data/settlements';

@Component({
  selector: 'app-settlements',
  imports: [],
  templateUrl: './settlements.html',
  styleUrl: './settlements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settlements implements OnInit {

  hamlet?: ReturnType<typeof calcHamlet>;
  village?: ReturnType<typeof calcVillage>;

  ngOnInit(): void {
    this.onCalcHamlet();
    this.onCalcVillage();
  }

  onCalcHamlet() {
    this.hamlet = calcHamlet();
  }

  onCalcVillage() {
    this.village = calcVillage();
  }
}
