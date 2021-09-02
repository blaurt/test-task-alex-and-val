import express from "express";
import { Request, Response } from "express";
import { FlightsService } from "./modules/flight/flight.service";

const app = express();
const port = 3000;

const service = new FlightsService();

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/get-flights", (_: Request, res: Response) => {
  const carrier = "UA";
  // const carrier = "AA";

  const duration = 3;
  const departureTimeRange = [
    "2017-06-01T21:21:17.272Z",
    "2017-06-01T21:21:17.412Z",
  ] as const;
  service.getFlights(departureTimeRange, duration, carrier).then((data) => {
    console.log("RESULT: \n" + JSON.stringify(data, null, 2));
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
