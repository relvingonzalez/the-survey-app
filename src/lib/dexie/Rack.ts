import { Coordinate } from "../types/question";
import { Entity } from "dexie";
import DexieObject from "./DexieObject";
import { ServerRack } from "../types/server";
import { saveRack } from "../api/actions";
import {
  ActionFlag,
  addItem,
  addItems,
  addItemsFromServer,
  createItem,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  Room,
  saveItem,
  shouldIncludeId,
  updateItem,
  type TheSurveyAppDB,
} from "../../../internal";

export class Rack extends Entity<TheSurveyAppDB> implements DexieObject<Rack> {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  roomId!: number;
  x!: Coordinate;
  y!: Coordinate;
  comment!: string;
  name!: string;

  static create({ ...props }: Partial<Rack>) {
    return createItem(Rack.prototype, props);
  }

  static add({ ...props }: Partial<Rack>) {
    return addItem(db.racks, Rack.create(props));
  }

  static async bulkAdd(racks: Partial<Rack>[]) {
    return addItems(Rack.add, racks);
  }

  static async bulkAddFromServer(racks: Partial<Rack>[]) {
    return addItemsFromServer(Rack.add, racks);
  }

  static async getByRoom({ id: roomId }: Room) {
    return await db.racks
      .where({ roomId })
      .and((r) => r.flag !== "d")
      .toArray();
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.racks);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.racks);
  }

  static async sync() {
    const racks = await Rack.getAllUpdated();
    if (racks.length) {
      await Promise.all(
        racks.map(async (r) => {
          const savedRack = await saveRack(r.serialize());
          return r.syncFromServer(savedRack);
        }),
      );
    }
  }

  async save() {
    return saveItem(this.db.racks, this);
  }

  async update(props: Partial<Rack>) {
    return updateItem(this.db.racks, this.localId, props);
  }

  async delete() {
    return this.db.transaction("rw", [this.db.racks, this.db.hardwares], () => {
      if (this.flag === "i" || this.flag === null) {
        this.db.racks.where({ id: this.id }).delete();
      } else {
        this.db.racks.where({ id: this.id }).modify({ flag: "d" });
      }

      this.db.hardwares.where({ rackId: this.id }).delete();
    });
  }

  async syncFromServer({ id }: ServerRack) {
    return this.db.transaction("rw", [this.db.racks, this.db.hardwares], () => {
      if (this.flag === "d") {
        this.db.racks.where({ localId: this.localId }).delete();
      } else {
        this.db.racks.where({ id: this.id }).modify({ id: id, flag: "o" });
        this.db.hardwares.where({ rackId: this.id }).modify({ rackId: id });
      }
    });
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      flag: this.flag,
      name: this.name,
      roomId: this.roomId,
      comment: this.comment,
      x: this.x,
      y: this.y,
    };
  }
}
