import { Hardware, MoreInfo, Rack, Room } from "../types/rooms";

export const dummyHardware = {
  name: "Dummy Hardware",
  from: "2342432",
  to: "3453245325",
  details: "Amazing Hardware",
};

export const dummyRack: Rack = {
  x: 201.23,
  y: 134,
  name: "Dummy Rack",
  comment: "Comment",
};

export const dummyMoreInfo: MoreInfo = {
  x: 120.23,
  y: 89,
  info: "Amazing Info",
};

export const dummyRoom: Room = {
  id: 1,
  projectId: 1,
  name: "Dummy Room",
  comment: "",
};

export const dummyRooms: Room[] = [dummyRoom, dummyRoom, dummyRoom, dummyRoom];

export const createHardware = (args?: Partial<Hardware>): Hardware => ({
  name: "",
  from: "",
  to: "",
  details: "",
  ...args,
});

export const createMoreInfo = (args?: Partial<MoreInfo>): MoreInfo => ({
  info: "",
  x: 0,
  y: 0,
  ...args,
});
