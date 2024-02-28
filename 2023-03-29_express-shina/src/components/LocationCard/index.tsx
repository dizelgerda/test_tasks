import { Coordinates, Location } from "../../types";
import "./styles.scss";

interface LocationCardProps extends Location {
  onClick: (data: Coordinates, key: number) => void;
  isSelected: boolean;
  id: number;
}

export default function LocationCard({
  address,
  budgets,
  onClick,
  isSelected,
  id,
  ...coordinates
}: LocationCardProps) {
  function handleClick() {
    onClick(coordinates, id);
  }

  return (
    <div
      className={`card ${isSelected ? "card_selected" : ""}`}
      onClick={handleClick}
    >
      <p className="card__title">{address}</p>
      <ul className="card__badges">
        {budgets.map((type, index) => {
          return (
            <li className="card__badge" key={index}>
              {type}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
