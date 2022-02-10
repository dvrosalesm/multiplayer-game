import { Entity } from ".";

export class Cell {
  public index: number;
  public entity?: Entity;

  constructor(index: number) {
    this.index = index;
    this.entity = null;
  }

  public setEntity(entity: Entity): void {
    this.entity = entity;
    entity.cell = this;
  }

  public clearEntity(): void {
    this.entity.cell = null;
    this.entity = null;
  }

  public hasEntity(): boolean {
    return this.entity !== null;
  }
}