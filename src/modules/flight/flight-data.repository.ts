import axios from "axios";
import { FlightData } from "./flight-data.interface";

const DATA_URL =
  "https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt";

export class FlightDataRepository {
  public async getFlights(): Promise<FlightData[]> {
    const response = await axios.get(DATA_URL);

    return response.data;
  }
}
