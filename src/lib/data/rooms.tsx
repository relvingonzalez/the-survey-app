import { MoreInfo, Rack, Room } from "../types/rooms";

export const dummyHardware = {
  name: "Dummy Hardware",
  from: "2342432",
  to: "3453245325",
  details: "Amazing Hardware",
};

export const dummyRack: Rack = {
  x: 1.23,
  y: 34,
  rackName: "Dummy Rack",
  rackComment: "Comment",
  rackList: [dummyHardware, dummyHardware],
};

export const dummyMoreInfo: MoreInfo = {
  x: 1.23,
  y: 34,
  info: "Amazing Info",
};

export const dummyRoom: Room = {
  id: "1",
  name: "Dummy Room",
  comment: "",
  racks: [dummyRack, dummyRack],
  moreInfo: [dummyMoreInfo],
};

export const dummyRooms: Room[] = [dummyRoom, dummyRoom, dummyRoom, dummyRoom];
