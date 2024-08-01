import { Entity } from "dexie";
import { ActionFlag } from "../types/dexie";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import DexieObject from "./DexieObject";
import { TheSurveyAppDB } from "./TheSurveyAppDB";
import { db } from "./db";
import { ServerHardware } from "../types/server";

export default class Hardware extends Entity<TheSurveyAppDB> implements DexieObject<Hardware>{
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  rackId!: number;
  name!: string;
  fromSlot!: string;
  toSlot!: string;
  details!: string;

  // Create type object without inserting
  static create({...props}: Partial<Hardware>) {
    const hardware = Object.create(Hardware.prototype);
    Object.assign(hardware, props);
    hardware.id = hardware.id ?? uniqueId();
    hardware.flag = null;
    return hardware;
  }

  static async add({...props}: Partial<Hardware>) {
    const hardware = Hardware.create(props);
    const addedId = await db.hardwares.add(hardware);
    return db.hardwares.get(addedId);
  };

  static async bulkAdd(hardwares: Partial<Hardware>[]) {
    return hardwares.map(this.add);
  }

  async delete() {
    return db.transaction("rw", db.hardwares, () => {
      if (this.flag === "i") {
        db.hardwares.where({ id: this.id }).delete();
      } else {
        db.hardwares.where({ id: this.id }).modify({ flag: "d" });
      }
    });
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await this.db.hardwares.put(this);
  }

  async update({...props}: Partial<Hardware>) {
    return this.db.hardwares.update(this.localId, { ...props });
  }

  async syncWithServer({ id }: ServerHardware){
    return this.db.transaction(
      "rw",
      [this.db.hardwares],
      () => {
        if (this.flag === 'd') {
          this.db.hardwares.where({ localId: this.localId }).delete();
        } else {
          this.db.hardwares.where({ id: this.id }).modify({ id, flag: null });
        }
      }
    );
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
