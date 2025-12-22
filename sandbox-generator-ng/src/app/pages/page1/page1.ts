import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  calcHexesBiome,
  calcHexesFeature,
  calcNextHexBiome,
  calcNextHexFeature,
  calcStartingHexBiome,
  calcStartingHexFeature,
} from '../../../data/data';
import { tableStartingHexBiome, tableStartingHexFeature } from '../../../data/random-tables';
import { OptionWithFollowUp } from '../../../domain/random-tables';

@Component({
  selector: 'app-page1',
  imports: [CommonModule],
  templateUrl: './page1.html',
  styleUrl: './page1.scss',
})
export class Page1 {

  readonly tableStartingHexBiome = tableStartingHexBiome;

  startingHexBiomeResult: string = '';
  nextHexBiomeResult: string = '';
  hexesBiome: { [key: number]: string } = {};

  onSelectStartingHexBiome() {
    this.startingHexBiomeResult = calcStartingHexBiome();
    this.nextHexBiomeResult = calcNextHexBiome(this.startingHexBiomeResult);
  }

  onCalcHexesBiome() {
    this.hexesBiome = calcHexesBiome();
  }

  readonly tableStartingHexFeature = tableStartingHexFeature;

  startingHexFeatureResult: string = '';
  nextHexFeatureResult: string | OptionWithFollowUp = '';
  hexesFeature: { [key: number]: string } = {};

  onSelectStartingHexFeature() {
    this.startingHexFeatureResult = calcStartingHexFeature();
    this.nextHexFeatureResult = calcNextHexFeature();
  }

  onCalcHexesFeature() {
    this.hexesFeature = calcHexesFeature();
  }
}
