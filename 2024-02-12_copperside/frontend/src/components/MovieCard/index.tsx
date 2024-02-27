import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Form,
  Stack,
} from "react-bootstrap";

interface MovieCardProps {
  id: string;
  poster: string;
  name: string;
  year: string;

  saved: boolean;
  rating: string | number | null;

  onAdd?(mdbID: string, newRating?: number): void;
  onUpdate(mdbID: string, newRating: number): void;
  onRemove(mdbID: string): void;
}

export default function MovieCard({
  id,
  name,
  year,
  poster,
  saved,
  rating,
  onAdd,
  onUpdate,
  onRemove,
}: MovieCardProps) {
  function handleSelect(eventKey: string | null) {
    if (eventKey === "remove-action") {
      onUpdate(id, 0);
    }

    if (saved) {
      onUpdate(id, Number(eventKey));
    } else {
      onAdd!(id, Number(eventKey));
    }
  }

  return (
    <Card className="h-100 position-relative">
      <Card.Img variant="top" src={poster} />
      {rating ? (
        <Badge
          pill
          style={{ position: "absolute", top: "10px", right: "10px" }}
          bg="warning"
          text="dark"
        >
          Ваша оценка: {rating}
        </Badge>
      ) : null}
      <Card.Body>
        <Link href={`/movies/${id}`}>
          <Card.Title>{name} ↗</Card.Title>
        </Link>
        <Stack className="justify-content-between" direction="horizontal">
          <Card.Text className="m-0">{year}</Card.Text>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Form>
          <Stack direction="horizontal" gap={2}>
            {saved ? (
              <Button
                variant="outline-danger"
                size="sm"
                type="button"
                onClick={() => onRemove(id)}
              >
                Удалить
              </Button>
            ) : (
              <Button
                variant="outline-light"
                size="sm"
                type="button"
                onClick={() => onAdd!(id)}
              >
                Смотрел
              </Button>
            )}
            <DropdownButton
              className="ms-auto"
              variant="outline-light"
              drop="down-centered"
              title="Оценить"
              size="sm"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="1">1</Dropdown.Item>
              <Dropdown.Item eventKey="2">2</Dropdown.Item>
              <Dropdown.Item eventKey="3">3</Dropdown.Item>
              <Dropdown.Item eventKey="4">4</Dropdown.Item>
              <Dropdown.Item eventKey="5">5</Dropdown.Item>
              {rating ? (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="link-danger"
                    eventKey="remove-action"
                  >
                    Удалить оценку
                  </Dropdown.Item>
                </>
              ) : null}
            </DropdownButton>
          </Stack>
        </Form>
      </Card.Footer>
    </Card>
  );
}
