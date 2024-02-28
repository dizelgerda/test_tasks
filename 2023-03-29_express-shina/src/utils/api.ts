import { Location } from "../types";

const BASE_URL = "https://express-shina.ru/vacancy";

export async function getLocations(): Promise<Location[] | null> {
  try {
    const data = await fetch(`${BASE_URL}/geo-state`, {
      method: "GET",
    });
    return (await data.json()).pickPoints;
  } catch (err) {
    console.error(err);
    return null;
  }
}
