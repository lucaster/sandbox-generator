import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { calcCastle, calcCity, calcHamlet, calcTower, calcVillage } from '../../../data/settlements';

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
  tower?: ReturnType<typeof calcTower>;

  ngOnInit(): void {
    this.onCalcHamlet();
    this.onCalcVillage();
    this.onCalcCity();
    this.onCalcCastle();
    this.onCalcTower();
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

  onCalcTower() {
    this.tower = calcTower();
  }
}
