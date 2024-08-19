import { Entity } from "dexie";
import DexieObject from "./DexieObject";
import { ServerHardware } from "../types/server";
import { saveHardware } from "../api/actions";
import {
  ActionFlag,
  addItem,
  addItems,
  addItemsFromServer,
  createItem,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  Rack,
  saveItem,
  shouldIncludeId,
  updateItem,
  type TheSurveyAppDB,
} from "../../../internal";

export class Hardware
  extends Entity<TheSurveyAppDB>
  implements DexieObject<Hardware>
{
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  rackId!: number;
  name!: string;
  fromSlot!: string;
  toSlot!: string;
  details!: string;

  static create({ ...props }: Partial<Hardware>) {
    return createItem(Hardware.prototype, props);
  }

  static add({ ...props }: Partial<Hardware>) {
    return addItem(db.hardwares, Hardware.create(props));
  }

  static async bulkAdd(hardwares: Partial<Hardware>[]) {
    return addItems(Hardware.add, hardwares);
  }

  static async bulkAddFromServer(hardwares: Partial<Hardware>[]) {
    return addItemsFromServer(Hardware.add, hardwares);
  }

  static async getByRack({ id: rackId }: Rack) {
    return await db.hardwares
      .where({ rackId })
      .and((h) => h.flag !== "d")
      .toArray();
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.hardwares);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.hardwares);
  }

  static updateHardwareList(hardwareList: Hardware[]) {
    return db.transaction("rw", db.hardwares, async () => {
      // If new list does not have one that existed, either edit the flag to d if old, or delete it if new
      db.hardwares
        .where("id")
        .noneOf(hardwareList.map((h) => h.id))
        .and((h) => h.flag === "i")
        .delete();
      db.hardwares
        .where("id")
        .noneOf(hardwareList.map((h) => h.id))
        .and((h) => h.flag !== "i")
        .modify({ flag: "d" });
      // If new list has one that didn't exist, put
      db.hardwares.bulkPut(hardwareList);
    });
  }

  static async sync() {
    const hardwares = await Hardware.getAllUpdated();
    if (hardwares.length) {
      await Promise.all(
        hardwares.map(async (h) => {
          const savedHardware = await saveHardware(h.serialize());
          return h.syncFromServer(savedHardware);
        }),
      );
    }
  }

  async delete() {
    return db.transaction("rw", db.hardwares, () => {
      if (this.flag === "i" || this.flag === null) {
        db.hardwares.where({ id: this.id }).delete();
      } else {
        db.hardwares.where({ id: this.id }).modify({ flag: "d" });
      }
    });
  }

  async save() {
    return saveItem(this.db.hardwares, this);
  }

  async update(props: Partial<Hardware>) {
    return updateItem(this.db.hardwares, this.localId, props);
  }

  async syncFromServer({ id }: ServerHardware) {
    return this.db.transaction("rw", [this.db.hardwares], () => {
      if (this.flag === "d") {
        this.db.hardwares.where({ localId: this.localId }).delete();
      } else {
        this.db.hardwares.where({ id: this.id }).modify({ id, flag: "o" });
      }
    });
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      flag: this.flag,
      rackId: this.rackId,
      name: this.name,
      fromSlot: this.fromSlot,
      toSlot: this.toSlot,
      details: this.details,
    };
  }
}
