import { Component, Output } from '@angular/core';
import { calcNextHex, startingHex } from '../../../data/data';
import { d } from '../../../dice/dice';
import { Question } from '../../../domain/questions';

@Component({
  selector: 'app-page1',
  imports: [],
  templateUrl: './page1.html',
  styleUrl: './page1.scss',
})
export class Page1 {

  @Output() startingHexResult: string = '';

  readonly startingHex: Question = startingHex;

  onSelectStartingHex() {
    this.startingHexResult = this.selectStartingHex();
  }

  selectStartingHex(): string {
    const faces: number = this.keyNum(this.startingHex.options);
    const key: number = d(faces);
    const result = this.startingHex.options[key];
    if (typeof result === 'string') {
      return result;
    }
    else  {
      return result.text;
    }
  }

  calcNextHex(previousHex: string): string {
    return calcNextHex(previousHex);
  }

  private keyNum(obj: object): number {
    return Object.keys(obj).length;
  }
}
