import { UUID } from "./util";

type Coordinate = number;

export type MoreInfo = {
  x: Coordinate;
  y: Coordinate;
  info: string;
};

export type Hardware = {
  name: string;
  from: string;
  to: string;
  details: string;
};

export type Rack = {
  x: Coordinate;
  y: Coordinate;
  rackComment: string;
  rackName: string;
  hardwareList: Hardware[];
};

export type Room = {
  id: UUID;
  name: string;
  comment: string;
  racks: Rack[];
  moreInfo: MoreInfo[];
};

export type NewRoom = Omit<Room, "id">;

export type Rooms = Room[];
