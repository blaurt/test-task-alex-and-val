import express from "express";
import { Request, Response } from "express";
import { FlightsService } from "./modules/flight/flight.service";

const app = express();
const port = 3000;

const service = new FlightsService()

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/get-flights", (req: Request, res: Response) => {
  const carrier = 'SJC';
  const duration = 3;
  const depTime= [
    "2017-06-01T21:21:17.272Z",
    "2017-06-01T21:21:17.276Z"
  ]
  service.getFlights(depTime,duration,carrier).then(data=> res.json(data));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
