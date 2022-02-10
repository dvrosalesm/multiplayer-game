import { Entity, EntityOptions, Player, PlayerOptions } from "../core";

enum ENTITY_TYPES {
  PLAYER,
  OBSTACLE,
  COIN,
};

export class EntityFactory {

  static ENTITY_TYPES = ENTITY_TYPES;

  public static create(type: ENTITY_TYPES, options: EntityOptions): Entity {
    if(type === ENTITY_TYPES.PLAYER) {
      return this.createPlayer(options as PlayerOptions);
    } else if (type === ENTITY_TYPES.OBSTACLE) {
      // TODO: Implement obstacle logic
    } else if (type === ENTITY_TYPES.COIN) {
      // TODO: Implement coin logic
    }

    return null;
  }

  private static createPlayer(options: PlayerOptions): Entity {
    return new Player(options);
  }

};