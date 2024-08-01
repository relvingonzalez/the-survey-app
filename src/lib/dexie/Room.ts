import { Entity } from "dexie";
import { ActionFlag } from "../types/dexie";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";
import DexieObject from "./DexieObject";
import { TheSurveyAppDB } from "./TheSurveyAppDB";
import { ServerRoom } from "../types/server";

export default class Room extends Entity<TheSurveyAppDB> implements DexieObject<Room>{
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  projectId!: number;
  name!: string;
  comment!: string;

  static create({...props}: Partial<Room>) {
    const room = Object.create(Room.prototype);
    Object.assign(room, props);
    room.id = room.id || uniqueId();
    room.flag = null;
    return room;
  }


  static async add({...props}: Partial<Room>) {
    const room = Room.create(props);
    const addedId = await db.rooms.add(room);
    return db.rooms.get(addedId);
  };

  static async bulkAdd(rooms: Partial<Room>[]) {
    return rooms.map(this.add);
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await db.rooms.put(this);
  }

  async delete() {
    return db.transaction("rw", db.rooms, () => {
      if (this.flag === "i") {
        db.rooms.where({ id: this.id }).delete();
      } else {
        db.rooms.where({ id: this.id }).modify({ flag: "d" });
      }

      this.clearRoomTools();
    });
  }

  async update({...props}: Partial<Room>) {
    return this.db.rooms.update(this.localId, { ...props });
  }

  async clearRoomTools() {
    return db.transaction(
      "rw",
      [db.rooms, db.racks, db.hardwares],
      async () => {
        const racks = await db.racks.where({ roomId: this.id }).toArray();
        db.hardwares
          .where("rackId")
          .anyOf(racks.map((r) => r.id))
          .each(function (value) {
            value.delete();
          });
        db.racks.where({ roomId: this.id }).each(function (value) {
          value.delete();
        });
        db.moreInfos.where({ roomId: this.id }).each(function (value) {
          value.delete();
        });
      },
    );
  }

  async syncWithServer({ id }: ServerRoom){
    return this.db.transaction(
      "rw",
      [this.db.rooms, this.db.racks, this.db.moreInfos],
      () => {
        if (this.flag === 'd') {
          this.db.rooms.where({ localId: this.localId }).delete();
        } else {
          db.rooms.where({ id: this.id }).modify({ id, flag: null });
          db.racks.where({ roomId: this.id }).modify({ roomId: id });
          db.moreInfos.where({ roomId: this.id }).modify({ roomId: id });
        }
      }
    );
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      flag: this.flag,
      projectId: this.projectId,
      name: this.name,
      comment: this.comment,
    };
  }
}
