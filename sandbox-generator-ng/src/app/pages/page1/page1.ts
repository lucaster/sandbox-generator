import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calcNextHex, tableStartingHex, calcHexes, randomOption} from '../../../data/data';

@Component({
  selector: 'app-page1',
  imports: [CommonModule],
  templateUrl: './page1.html',
  styleUrl: './page1.scss',
})
export class Page1 {

  readonly tableStartingHex = tableStartingHex;
  startingHexResult: string = '';
  nextHexResult: string = '';
  hexes: { [key: number]: string } = {};

  onSelectStartingHex() {
    this.startingHexResult = this.selectStartingHex();
    this.nextHexResult = calcNextHex(this.startingHexResult);
  }

  private selectStartingHex(): string {
    const result = randomOption(tableStartingHex.options);
    if (typeof result === 'string') {
      return result;
    }
    else  {
      return result.text;
    }
  }

  onCalcHexes() {
    this.hexes = calcHexes();
  }
}
