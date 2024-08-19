import { Entity } from "dexie";
import { Coordinate } from "../types/question";
import DexieObject from "./DexieObject";
import { ServerMoreInfo } from "../types/server";
import { saveMoreInfo } from "../api/actions";
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
export class MoreInfo
  extends Entity<TheSurveyAppDB>
  implements DexieObject<MoreInfo>
{
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  roomId!: number;
  x!: Coordinate;
  y!: Coordinate;
  info!: string;

  static create({ ...props }: Partial<MoreInfo>) {
    return createItem(MoreInfo.prototype, { ...props, info: "" });
  }

  static add({ ...props }: Partial<MoreInfo>) {
    return addItem(db.moreInfos, MoreInfo.create(props));
  }

  static async bulkAdd(moreInfos: Partial<MoreInfo>[]) {
    return addItems(MoreInfo.add, moreInfos);
  }

  static async bulkAddFromServer(moreInfos: Partial<MoreInfo>[]) {
    return addItemsFromServer(MoreInfo.add, moreInfos);
  }

  static async getByRoom({ id: roomId }: Room) {
    return await db.moreInfos
      .where({ roomId })
      .and((mI) => mI.flag !== "d")
      .toArray();
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.moreInfos);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.moreInfos);
  }

  static async sync() {
    const moreInfos = await MoreInfo.getAllUpdated();
    if (moreInfos.length) {
      await Promise.all(
        moreInfos.map(async (m) => {
          const savedMoreInfo = await saveMoreInfo(m.serialize());
          return m.syncFromServer(savedMoreInfo);
        }),
      );
    }
  }

  async save() {
    return saveItem(this.db.moreInfos, this);
  }

  async update(props: Partial<MoreInfo>) {
    return updateItem(this.db.moreInfos, this.localId, props);
  }

  async delete() {
    return db.transaction("rw", db.moreInfos, () => {
      if (this.flag === "i" || this.flag === null) {
        db.moreInfos.where({ id: this.id }).delete();
      } else {
        db.moreInfos.where({ id: this.id }).modify({ flag: "d" });
      }
    });
  }

  async syncFromServer({ id }: ServerMoreInfo) {
    return this.db.transaction("rw", [this.db.moreInfos], () => {
      if (this.flag === "d") {
        this.db.moreInfos.where({ localId: this.localId }).delete();
      } else {
        this.db.moreInfos.where({ id: this.id }).modify({ id, flag: "o" });
      }
    });
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      flag: this.flag,
      roomId: this.roomId,
      info: this.info,
      x: this.x,
      y: this.y,
    };
  }
}
