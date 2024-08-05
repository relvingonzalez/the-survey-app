import { Coordinate } from "../types/question";
import { Entity } from "dexie";
import DexieObject from "./DexieObject";
import { ServerRack } from "../types/server";
import { saveRack } from "../api/actions";
import {
  ActionFlag,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  Room,
  shouldIncludeId,
  type TheSurveyAppDB,
  uniqueId,
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
    const rack = Object.create(Rack.prototype);
    Object.assign(rack, props);
    rack.id = rack.id ?? uniqueId();
    rack.flag = null;
    rack.rack = "";
    return rack;
  }

  static async add({ ...props }: Partial<Rack>) {
    const rack = Rack.create(props);
    const addedId = await db.racks.add(rack);
    return db.racks.get(addedId);
  }

  static async bulkAdd(racks: Partial<Rack>[]) {
    return racks.map(Rack.add);
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
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await this.db.racks.put(this);
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

  async update({ ...props }: Partial<Rack>) {
    return this.db.racks.update(this.localId, { ...props });
  }

  async syncFromServer({ id }: ServerRack) {
    return this.db.transaction("rw", [this.db.racks, this.db.hardwares], () => {
      if (this.flag === "d") {
        this.db.racks.where({ localId: this.localId }).delete();
      } else {
        this.db.racks.where({ id: this.id }).modify({ id: id, flag: null });
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
