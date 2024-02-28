import { TNews } from "@helpers/types";
import Link from "next/link";
import { Button, Card, Stack } from "react-bootstrap";

interface NewsCardProps extends TNews {
  onDelete(id: string): void;
}

export default function NewsCard({
  _id,
  published,
  publishedAt,
  onDelete,
}: NewsCardProps) {
  const publicationDate = new Date(publishedAt);

  function handleDelete() {
    onDelete(_id);
  }

  return (
    <Card>
      <Card.Body>
        <Link href={`/news/${_id}`}>
          <Card.Title className="mb-3">Новость {_id}</Card.Title>{" "}
        </Link>
        <Stack direction="horizontal" gap={2}>
          <Button
            size="sm"
            variant="outline-danger"
            type="button"
            onClick={handleDelete}
          >
            Удалить
          </Button>

          <Link href={`/news/edit?newsID=${_id}`}>
            <Button size="sm" variant="outline-secondary">
              Изменить
            </Button>
          </Link>
        </Stack>
      </Card.Body>
      {!published ? (
        <Card.Footer>
          Будет опубликована: {publicationDate.toLocaleString()}
        </Card.Footer>
      ) : null}
    </Card>
  );
}
