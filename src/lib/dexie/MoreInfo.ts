import { Entity } from "dexie";
import { ActionFlag } from "../types/dexie";
import { Coordinate } from "../types/question";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";
import DexieObject from "./DexieObject";
import { TheSurveyAppDB } from "./TheSurveyAppDB";
export default class MoreInfo extends Entity<TheSurveyAppDB> implements DexieObject<MoreInfo> {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  roomId!: number;
  x!: Coordinate;
  y!: Coordinate;
  info!: string;

  static create({...props}: Partial<MoreInfo>) {
    const moreInfo = Object.create(MoreInfo.prototype);
    Object.assign(moreInfo, props);
    moreInfo.id = moreInfo.id ?? uniqueId();
    moreInfo.flag = null;
    moreInfo.moreInfo = "";
    return moreInfo;
  }


  static async add({...props}: Partial<MoreInfo>) {
    const moreInfo = MoreInfo.create(props);
    const addedId = await db.moreInfos.add(moreInfo);
    return db.moreInfos.get(addedId);
  };

  static async bulkAdd(moreInfos: Partial<MoreInfo>[]) {
    return moreInfos.map(this.add);
  }
  
  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await db.moreInfos.put(this);
  }

  async delete() {
    return db.transaction("rw", db.moreInfos, () => {
      if (this.flag === "i") {
        db.moreInfos.where({ id: this.id }).delete();
      } else {
        db.moreInfos.where({ id: this.id }).modify({ flag: "d" });
      }
    });
  }

  async update({...props}: Partial<MoreInfo>) {
    return this.db.moreInfos.update(this.localId, { ...props });
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
