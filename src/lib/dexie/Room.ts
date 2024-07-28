import { ActionFlag } from "../types/dexie";
import { ServerRoom } from "../types/server";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";

export default class Room {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  projectId!: number;
  name!: string;
  comment!: string;

  constructor({ ...props }: Partial<Room>) {
    Object.assign(this, props);
    this.id = this.id || uniqueId();
    this.flag = this.flag || "i";
  }

  static deserialize({ ...serverProps }: ServerRoom) {
    return new Room({ ...serverProps, flag: "o" });
  }

  static fromProject(projectId: number) {
    const room = Object.create(Room.prototype);
    room.projectId = projectId;
    room.name = "";
    room.comment = "";
    room.flag = "i";
    return room;
  }

  async save() {
    this.flag = this.flag === "i" ? "i" : "u";
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

  async update(room: Room) {
    return await db.rooms.update(this.localId, { ...room });
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

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      projectId: this.projectId,
      name: this.name,
      comment: this.comment,
    };
  }
}
