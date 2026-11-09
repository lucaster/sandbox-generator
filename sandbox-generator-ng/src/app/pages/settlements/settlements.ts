import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { d } from '../../../dice/dice';
import { calcAbbey, calcCastle, calcCity, calcHamlet, calcTower, calcVillage } from '../../../data/settlements';

const settlementTypes = ['Hamlet', 'Village', 'City', 'Castle', 'Tower', 'Abbey'] as const;
type SettlementType = (typeof settlementTypes)[number];

@Component({
  selector: 'app-settlements',
  imports: [],
  templateUrl: './settlements.html',
  styleUrl: './settlements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settlements {

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  readonly importError = signal<string | null>(null);
  hamlet?: ReturnType<typeof calcHamlet>;
  village?: ReturnType<typeof calcVillage>;
  city?: ReturnType<typeof calcCity>;
  castle?: ReturnType<typeof calcCastle>;
  tower?: ReturnType<typeof calcTower>;
  abbey?: ReturnType<typeof calcAbbey>;
  randomSettlementType?: SettlementType;

  onCalcRandomSettlement() {
    this.generateSettlement(settlementTypes[d(6) - 1]);
  }

  onCalcHamlet() {
    this.generateSettlement('Hamlet');
  }

  onCalcVillage() {
    this.generateSettlement('Village');
  }

  onCalcCity() {
    this.generateSettlement('City');
  }

  onCalcCastle() {
    this.generateSettlement('Castle');
  }

  onCalcTower() {
    this.generateSettlement('Tower');
  }

  onCalcAbbey() {
    this.generateSettlement('Abbey');
  }

  exportSettlement() {
    const settlement = this.getCurrentSettlement();
    const data = JSON.stringify(
      { type: this.randomSettlementType, settlement },
      null,
      2
    );
    const file = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settlement.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async importSettlement(event: Event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Settlement import requires a file input.');
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.importError.set(null);
    try {
      const imported = this.parseSettlement(JSON.parse(await file.text()));
      this.generateSettlement(imported.type, imported.settlement);
    } catch (error) {
      this.importError.set(
        `Unable to import settlement: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      input.value = '';
      this.changeDetectorRef.markForCheck();
    }
  }

  private getCurrentSettlement() {
    switch (this.randomSettlementType) {
      case 'Hamlet':
        return this.hamlet;
      case 'Village':
        return this.village;
      case 'City':
        return this.city;
      case 'Castle':
        return this.castle;
      case 'Tower':
        return this.tower;
      case 'Abbey':
        return this.abbey;
      default:
        throw new Error('Generate a settlement before exporting.');
    }
  }

  private parseSettlement(value: unknown): {
    type: SettlementType;
    settlement: unknown;
  } {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error('Expected a settlement JSON object.');
    }

    const { type, settlement } = value as Record<string, unknown>;
    if (
      typeof type !== 'string' ||
      !settlementTypes.includes(type as SettlementType) ||
      typeof settlement !== 'object' ||
      settlement === null ||
      Array.isArray(settlement)
    ) {
      throw new Error('Settlement JSON must contain a valid type and settlement object.');
    }

    return {
      type: type as SettlementType,
      settlement,
    };
  }

  private generateSettlement(
    type: SettlementType,
    settlement?: unknown
  ) {
    this.importError.set(null);
    this.hamlet = undefined;
    this.village = undefined;
    this.city = undefined;
    this.castle = undefined;
    this.tower = undefined;
    this.abbey = undefined;
    this.randomSettlementType = type;

    switch (type) {
      case 'Hamlet':
        this.hamlet =
          settlement === undefined
            ? calcHamlet()
            : (settlement as ReturnType<typeof calcHamlet>);
        break;
      case 'Village':
        this.village =
          settlement === undefined
            ? calcVillage()
            : (settlement as ReturnType<typeof calcVillage>);
        break;
      case 'City':
        this.city =
          settlement === undefined
            ? calcCity()
            : (settlement as ReturnType<typeof calcCity>);
        break;
      case 'Castle':
        this.castle =
          settlement === undefined
            ? calcCastle()
            : (settlement as ReturnType<typeof calcCastle>);
        break;
      case 'Tower':
        this.tower =
          settlement === undefined
            ? calcTower()
            : (settlement as ReturnType<typeof calcTower>);
        break;
      case 'Abbey':
        this.abbey =
          settlement === undefined
            ? calcAbbey()
            : (settlement as ReturnType<typeof calcAbbey>);
        break;
    }
  }
}
