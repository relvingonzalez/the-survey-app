import { Entity } from "dexie";
import { Coordinate } from "../types/question";
import DexieObject from "./DexieObject";
import { ServerMoreInfo } from "../types/server";
import { saveMoreInfo } from "../api/actions";
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
    const moreInfo = Object.create(MoreInfo.prototype);
    Object.assign(moreInfo, props);
    moreInfo.id = moreInfo.id ?? uniqueId();
    moreInfo.flag = null;
    moreInfo.moreInfo = "";
    return moreInfo;
  }

  static async add({ ...props }: Partial<MoreInfo>) {
    const moreInfo = MoreInfo.create(props);
    const addedId = await db.moreInfos.add(moreInfo);
    return db.moreInfos.get(addedId);
  }

  static async bulkAdd(moreInfos: Partial<MoreInfo>[]) {
    return moreInfos.map(MoreInfo.add);
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
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await db.moreInfos.put(this);
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

  async update({ ...props }: Partial<MoreInfo>) {
    return this.db.moreInfos.update(this.localId, { ...props });
  }

  async syncFromServer({ id }: ServerMoreInfo) {
    return this.db.transaction("rw", [this.db.moreInfos], () => {
      if (this.flag === "d") {
        this.db.moreInfos.where({ localId: this.localId }).delete();
      } else {
        this.db.moreInfos.where({ id: this.id }).modify({ id, flag: null });
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
