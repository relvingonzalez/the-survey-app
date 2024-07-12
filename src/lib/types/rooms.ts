export type Coordinate = number;

export type MoreInfo = {
  id: number;
  roomId: number;
  x: Coordinate;
  y: Coordinate;
  info: string;
};

export type Hardware = {
  id: number;
  rackId: number;
  name: string;
  fromSlot: string;
  toSlot: string;
  details: string;
};

export type Rack = {
  id: number;
  roomId: number;
  x: Coordinate;
  y: Coordinate;
  comment: string;
  name: string;
};

export type Room = {
  id: number;
  projectId: number;
  name: string;
  comment: string;
};

export type Rooms = Room[];
