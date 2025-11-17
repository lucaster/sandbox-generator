import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calcStartingHexTerrain, calcNextHexTerrain, tableStartingHexTerrain, calcHexesTerrain, randomOption} from '../../../data/data';

@Component({
  selector: 'app-page1',
  imports: [CommonModule],
  templateUrl: './page1.html',
  styleUrl: './page1.scss',
})
export class Page1 {

  readonly tableStartingHexTerrain = tableStartingHexTerrain;

  startingHexResult: string = '';
  nextHexResult: string = '';
  hexes: { [key: number]: string } = {};

  onSelectStartingHexTerrain() {
    this.startingHexResult = calcStartingHexTerrain();
    this.nextHexResult = calcNextHexTerrain(this.startingHexResult);
  }

  onCalcHexesTerrain() {
    this.hexes = calcHexesTerrain();
  }
}
