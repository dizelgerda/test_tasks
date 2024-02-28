import { useEffect, useState } from "react";
import { getLocations } from "../../utils/api";
import { Coordinates, Location } from "../../types";
import LocationCard from "../LocationCard";
import Map from "../Map";
import "./styles.scss";

interface SelectedLocation {
  id: number;
  coordinates: number[];
}

export default function Order() {
  const [locations, setLocations] = useState<Location[]>();
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  function handleClick(data: Coordinates, id: number): void {
    setSelectedLocation({ coordinates: [data.latitude, data.longitude], id });
  }

  async function init() {
    const data = await getLocations();
    if (data) {
      setLocations(data);
    } else {
      console.error("Ошибка API");
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="order">
      <div className="locations-list">
        {locations?.map((props, index) => {
          return (
            <LocationCard
              key={index}
              id={index}
              {...props}
              isSelected={selectedLocation?.id === index}
              onClick={handleClick}
            />
          );
        })}
      </div>

      <div className="map">
        <Map coordinates={selectedLocation && selectedLocation.coordinates} />
      </div>
    </div>
  );
}
