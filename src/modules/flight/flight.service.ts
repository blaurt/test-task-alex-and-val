import { FlightData } from "./flight-data.interface";
import { FlightDataRepository } from "./flight-data.repository";
import { min } from "lodash";

const PREFERRED_CARRIER_WEIGHT = 0.9;

export class FlightsService {
  private readonly repository: FlightDataRepository;

  public constructor() {
    this.repository = new FlightDataRepository();
  }
  public async getFlights(
    departureTimeRange: string[],
    maxFlightDuration: number,
    preferredCarrier: string
  ): Promise<FlightData[]> {
    const flights = await this.repository.getFlights();
    const flightScoreMap = new Map<number, FlightData[]>();

    const departureTimeMin = +new Date(departureTimeRange[0]);
    const departureTimeMax = +new Date(departureTimeRange[1]);

    flights.slice(0, 10).forEach((flight) => {
      const arrivalTime = +new Date(flight.arrivalTime);
      const departureTime = +new Date(flight.departureTime);

      if (departureTimeMin > departureTime) {
        console.log("breaks here");

        return;
      }
      const duration = (arrivalTime - departureTime) / (3600 * 1000);

      if (duration > maxFlightDuration) {
        return;
      }

      const durationInHours = duration / 1000 / 3600;
      const modifier =
        preferredCarrier === flight.carrier ? PREFERRED_CARRIER_WEIGHT : 1;
      const score = durationInHours * modifier + this.getDistance();
      console.log(
        "🚀 ~ file: flight.service.ts ~ line 48 ~ FlightsService ~ flights.slice ~ score",
        score
      );
      console.log(
        "🚀 ~ file: flight.service.ts ~ line 55 ~ FlightsService ~ flights.slice ~ flightScoreMap",
        flightScoreMap
      );

      const flightsInMap = flightScoreMap.get(score);
      if (flightsInMap) {
        flightScoreMap.set(score, [...flightsInMap, flight]);
      } else {
        flightScoreMap.set(score, [flight]);
      }
    });

    const minScore = min(Array.from(flightScoreMap.keys()));

    return flightScoreMap.get(minScore as number) || [];
  }

  private getDistance(): number {
    return 1;
  }
}
