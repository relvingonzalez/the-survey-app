import { Entity } from "dexie";
import DexieObject from "./DexieObject";
import { ServerRoom } from "../types/server";
import { saveRoom } from "../api/actions";
import {
  ActionFlag,
  addItem,
  addItems,
  addItemsFromServer,
  createItem,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  saveItem,
  shouldIncludeId,
  updateItem,
  type TheSurveyAppDB,
} from "../../../internal";

export class Room extends Entity<TheSurveyAppDB> implements DexieObject<Room> {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  projectId!: number;
  name!: string;
  comment!: string;

  // static create({ ...props }: Partial<Room>) {
  //   const room = Object.create(Room.prototype);
  //   Object.assign(room, props);
  //   room.id = room.id || uniqueId();
  //   room.flag = null;
  //   return room;
  // }

  // static async add({ ...props }: Partial<Room>) {
  //   const room = Room.create(props);
  //   const addedId = await db.rooms.add(room);
  //   return db.rooms.get(addedId);
  // }

  // static async bulkAdd(rooms: Partial<Room>[]) {
  //   return rooms.map(Room.add);
  // }

  static create({ ...props }: Partial<Room>) {
    return createItem(Room.prototype, props);
  }

  static add({ ...props }: Partial<Room>) {
    return addItem(db.rooms, Room.create(props));
  }

  static async bulkAdd(rooms: Partial<Room>[]) {
    return addItems(Room.add, rooms);
  }

  static async bulkAddFromServer(rooms: Partial<Room>[]) {
    return addItemsFromServer(Room.add, rooms);
  }

  static async getById(projectId: number, id?: number) {
    return id ? await db.rooms.get({ id }) : Room.add({ projectId });
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.rooms);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.rooms);
  }

  static async sync() {
    const rooms = await Room.getAllUpdated();
    if (rooms.length) {
      await Promise.all(
        rooms.map(async (r) => {
          const savedRoom = await saveRoom(r.serialize());
          return r.syncFromServer(savedRoom);
        }),
      );
    }
  }

  async save() {
    return saveItem(this.db.rooms, this);
  }

  async update(props: Partial<Room>) {
    return updateItem(this.db.rooms, this.localId, props);
  }

  async delete() {
    return this.db.transaction("rw", this.db.rooms, () => {
      if (this.flag === "i" || this.flag === null) {
        this.db.rooms.where({ id: this.id }).delete();
      } else {
        this.db.rooms.where({ id: this.id }).modify({ flag: "d" });
      }

      this.clearRoomTools();
    });
  }

  async clearRoomTools() {
    return this.db.transaction(
      "rw",
      [this.db.rooms, this.db.racks, this.db.hardwares],
      async () => {
        const racks = await this.db.racks.where({ roomId: this.id }).toArray();
        this.db.hardwares
          .where("rackId")
          .anyOf(racks.map((r) => r.id))
          .each(function (value) {
            value.delete();
          });
        this.db.racks.where({ roomId: this.id }).each(function (value) {
          value.delete();
        });
        this.db.moreInfos.where({ roomId: this.id }).each(function (value) {
          value.delete();
        });
      },
    );
  }

  async syncFromServer({ id }: ServerRoom) {
    return this.db.transaction(
      "rw",
      [this.db.rooms, this.db.racks, this.db.moreInfos],
      () => {
        if (this.flag === "d") {
          this.db.rooms.where({ localId: this.localId }).delete();
        } else {
          db.rooms.where({ id: this.id }).modify({ id, flag: "o" });
          db.racks.where({ roomId: this.id }).modify({ roomId: id });
          db.moreInfos.where({ roomId: this.id }).modify({ roomId: id });
        }
      },
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
