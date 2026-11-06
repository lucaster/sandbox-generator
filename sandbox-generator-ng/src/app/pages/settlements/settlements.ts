import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { calcCastle, calcCity, calcHamlet, calcVillage } from '../../../data/settlements';

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
  castle?: ReturnType<typeof calcCastle>;

  ngOnInit(): void {
    this.onCalcHamlet();
    this.onCalcVillage();
    this.onCalcCity();
    this.onCalcCastle();
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

  onCalcCastle() {
    this.castle = calcCastle();
  }
}
