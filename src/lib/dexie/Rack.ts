import { ActionFlag } from "../types/dexie";
import { ServerRack } from "../types/server";
import { Coordinate } from "../types/question";
import { db } from "./db";
import { shouldIncludeId, uniqueId } from "../utils/functions";

export default class Rack {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  roomId!: number;
  x!: Coordinate;
  y!: Coordinate;
  comment!: string;
  name!: string;

  constructor({ ...props }: Partial<Rack>) {
    Object.assign(this, props);
    this.id = this.id || uniqueId();
    this.flag = this.flag || "i";
  }

  static deserialize({ ...serverProps }: ServerRack) {
    return new Rack({ ...serverProps, flag: "o" });
  }

  static fromRoom(roomId: number, x: number, y: number) {
    return new Rack({ roomId, x, y });
  }

  async save() {
    this.flag = this.flag === "i" ? "i" : "u";
    return await db.racks.put(this);
  }

  async delete() {
    return db.transaction("rw", [db.racks, db.hardwares], () => {
      if (this.flag === "i") {
        db.racks.where({ id: this.id }).delete();
      } else {
        db.racks.where({ id: this.id }).modify({ flag: "d" });
      }

      db.hardwares.where({ rackId: this.id }).delete();
    });
  }

  async update(rack: Rack) {
    return await db.racks.update(this.localId, { ...rack });
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      name: this.name,
      roomId: this.roomId,
      comment: this.comment,
      x: this.x,
      y: this.y,
    };
  }
}
