import { ActionFlag } from "../types/dexie";
import { Coordinate } from "../types/question";
import { db } from "./db";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { Entity } from "dexie";
import DexieObject from "./DexieObject";
import { TheSurveyAppDB } from "./TheSurveyAppDB";
import { ServerRack } from "../types/server";

export default class Rack extends Entity<TheSurveyAppDB> implements DexieObject<Rack>{
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  roomId!: number;
  x!: Coordinate;
  y!: Coordinate;
  comment!: string;
  name!: string;

  static create({...props}: Partial<Rack>) {
    const rack = Object.create(Rack.prototype);
    Object.assign(rack, props);
    rack.id = rack.id ?? uniqueId();
    rack.flag = null;
    rack.rack = "";
    return rack;
  }


  static async add({...props}: Partial<Rack>) {
    const rack = Rack.create(props);
    const addedId = await db.racks.add(rack);
    return db.racks.get(addedId);
  };

  static async bulkAdd(racks: Partial<Rack>[]) {
    return racks.map(this.add);
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
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

  async update({...props}: Partial<Rack>) {
    return this.db.racks.update(this.localId, { ...props });
  }

  async syncWithServer({ id }: ServerRack){
    return this.db.transaction(
      "rw",
      [this.db.racks, this.db.hardwares],
      () => {
        if (this.flag === 'd') {
          this.db.racks.where({ localId: this.localId }).delete();
        } else {
          this.db.racks.where({ id: this.id }).modify({ id: id, flag: null });
          this.db.hardwares.where({ rackId: this.id }).modify({ rackId: id });
        }
      }
    );
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
