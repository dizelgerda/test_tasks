/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from "react";
import "./styles.scss";

interface MapProps {
  coordinates: number[] | null;
}

const LOCATION_DEFAULT = {
  center: [55.76, 37.64],
  zoom: 10,
};

export default function Map({ coordinates }: MapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState();

  function addPoint(coordinates: number[]) {
    // @ts-ignores
    const point = new ymaps.GeoObject({
      geometry: {
        type: "Point",
        coordinates,
      },
    });
    // @ts-ignores
    map.geoObjects.add(point);
  }

  useEffect(() => {
    if (coordinates) {
      // @ts-ignores
      map.geoObjects.removeAll();
      addPoint(coordinates);
      // @ts-ignores
      map.setCenter(coordinates, 13);
    }
  }, [coordinates]);

  useEffect(() => {
    return () => {
      // @ts-ignore
      ymaps.ready(() => {
        setMap(
          // @ts-ignores
          new ymaps.Map(divRef.current, LOCATION_DEFAULT)
        );
      });
    };
  }, []);

  return <div id="yandex-map" className="map" ref={divRef}></div>;
}
