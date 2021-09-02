import { FlightData } from "./flight-data.interface";
import { FlightDataRepository } from "./flight-data.repository";
import { min } from "lodash";

const PREFERRED_CARRIER_WEIGHT = 0.9;
const REGULAR_CARRIER_WEIGHT = 1;
const MILLISECONDS_IN_HOUR = 3600 * 1000;

type DepartureTimeRange = Readonly<[string, string]>;

export class FlightsService {
  private readonly repository: FlightDataRepository;

  public constructor() {
    this.repository = new FlightDataRepository();
  }
  public async getFlights(
    departureTimeRange: DepartureTimeRange,
    maxFlightDurationInHours: number,
    preferredCarrier: string
  ): Promise<FlightData[]> {
    const flights = await this.repository.getFlights();
    const flightScoreMap = new Map<number, FlightData[]>();

    const departureTimeMin = +new Date(departureTimeRange[0]);
    const departureTimeMax = +new Date(departureTimeRange[1]);

    flights.forEach((flight) => {
      const arrivalTime = +new Date(flight.arrivalTime);
      const flightDepartureTime = +new Date(flight.departureTime);

      if (
        this.isDepartureTimeOutOfDesiredTimeFrame(
          departureTimeMin,
          flightDepartureTime,
          departureTimeMax
        )
      ) {
        return;
      }

      const duration =
        (arrivalTime - flightDepartureTime) / MILLISECONDS_IN_HOUR;

      if (duration > maxFlightDurationInHours) {
        return;
      }

      const carrierPreferenceModifier = this.getWeigtModifier(
        preferredCarrier,
        flight.carrier
      );
      const score = duration * carrierPreferenceModifier + this.getDistance();

      const flightsInMap = flightScoreMap.get(score);
      if (flightsInMap) {
        flightScoreMap.set(score, [...flightsInMap, flight]);
      } else {
        flightScoreMap.set(score, [flight]);
      }
    });

    const minScore = min(Array.from(flightScoreMap.keys())) as number;

    return flightScoreMap.get(minScore) || [];
  }

  private getWeigtModifier(preferredCarrier: string, flightCarrier: string) {
    return preferredCarrier === flightCarrier
      ? PREFERRED_CARRIER_WEIGHT
      : REGULAR_CARRIER_WEIGHT;
  }

  private isDepartureTimeOutOfDesiredTimeFrame(
    departureTimeMin: number,
    flightDepartureTime: number,
    departureTimeMax: number
  ) {
    return (
      departureTimeMin > flightDepartureTime ||
      flightDepartureTime > departureTimeMax
    );
  }

  private getDistance(): number {
    return 1;
  }
}
