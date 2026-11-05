import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { calcCity, calcHamlet, calcVillage } from '../../../data/settlements';

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
  city?: ReturnType<typeof calcCity>;

  ngOnInit(): void {
    this.onCalcHamlet();
    this.onCalcVillage();
    this.onCalcCity();
  }

  onCalcHamlet() {
    this.hamlet = calcHamlet();
  }

  onCalcVillage() {
    this.village = calcVillage();
  }

  onCalcCity() {
    this.city = calcCity();
  }
}
