import { ActionFlag } from "../types/dexie";
import { Coordinate } from "../types/question";
import { ServerMoreInfo } from "../types/server";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";

export default class MoreInfo {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  roomId!: number;
  x!: Coordinate;
  y!: Coordinate;
  info!: string;

  constructor({ ...props }: Partial<MoreInfo>) {
    Object.assign(this, props);
    this.id = this.id || uniqueId();
    this.flag = this.flag || "i";
  }

  static deserialize({ ...serverProps }: ServerMoreInfo) {
    return new MoreInfo({ ...serverProps, flag: "o" });
  }

  static fromRoom(roomId: number, x: number, y: number) {
    return new MoreInfo({ roomId, x, y });
  }

  async save() {
    this.flag = this.flag === "i" ? "i" : "u";
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

  async update(moreInfo: MoreInfo) {
    return await db.moreInfos.update(this.localId, { ...moreInfo });
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      roomId: this.roomId,
      info: this.info,
      x: this.x,
      y: this.y,
    };
  }
}
