import { Component, Output } from '@angular/core';
import { calcNextHex, tableStartingHex, calcHexes, randomOption} from '../../../data/data';
import { d } from '../../../dice/dice';
import { Options, Question } from '../../../domain/questions';
import { keyNum } from '../../utils/object-utils';
import { CommonModule } from '@angular/common';

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
    this.nextHexResult = this.calcNextHex(this.startingHexResult);
  }

  selectStartingHex(): string {
    const options = tableStartingHex.options;
    const result = randomOption(options);
    if (typeof result === 'string') {
      return result;
    }
    else  {
      return result.text;
    }
  }

  calcNextHex = calcNextHex;

  onCalcHexes() {
    this.hexes = calcHexes();
  }
}
