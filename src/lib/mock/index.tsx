import express from "express";
import { registerHandlers } from "./mock-api-handlers";

const app = express();
const port = 3000;

registerHandlers(app);

app.listen(port, () => {
  console.log(`Mock API server is listening on port ${port}`);
});