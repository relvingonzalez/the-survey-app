import { Express } from "express";
import { dummySite } from "../data/sites";

const registerHandlerA = (app: Express) => {
  app.get(`${process.env.API_URL}/site/*`, (req, res) => {
    const mockApiResponse = dummySite;
    return res.status(200).json(mockApiResponse);
  });

  app.get(`${process.env.API_URL}/*`, (req, res) => {
    const mockApiResponse = dummySite;
    return res.status(200).json(mockApiResponse);
  });
}

export const registerHandlers = (app: Express)  => {
  registerHandlerA(app);
}
