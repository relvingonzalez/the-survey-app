import { ActionFlag } from "../types/dexie";
import { ServerHardware } from "../types/server";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import Rack from "./Rack";
import { db } from "./db";

export default class Hardware {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  rackId!: number;
  name!: string;
  fromSlot!: string;
  toSlot!: string;
  details!: string;

  constructor({ ...props }: Partial<Hardware>) {
    Object.assign(this, props);
    this.id = this.id || uniqueId();
    this.flag = this.flag || "i";
  }

  // Using new instead of Object.create throws exception
  static deserialize({ ...serverProps }: ServerHardware) {
    return new Hardware({ ...serverProps, flag: "o" });
  }

  static fromRack({ id }: Rack) {
    return new Hardware({ rackId: id });
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

  async update(hardware: Hardware) {
    return await db.hardwares.update(this.localId, { ...hardware });
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      rackId: this.rackId,
      name: this.name,
      fromSlot: this.fromSlot,
      toSlot: this.toSlot,
      details: this.details,
    };
  }
}
