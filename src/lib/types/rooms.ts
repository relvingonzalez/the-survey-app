export type Coordinate = number;

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
