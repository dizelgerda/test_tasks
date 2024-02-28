import { getUserByID } from "@helpers/api/users";
import { TNews, TUser } from "@helpers/types";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, OverlayTrigger, Popover, Stack } from "react-bootstrap";

export default function NewsData({ _id, files, owner, publishedAt }: TNews) {
  const [userData, setUserData] = useState<TUser>();

  async function handleChangeToggle(isShow: boolean) {
    if (isShow) {
      try {
        const res = await getUserByID(owner as string);
        if (res.ok) {
          setUserData(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <Card>
      <Card.Footer>{new Date(publishedAt).toLocaleString()}</Card.Footer>
      <Card.Body>
        <Link href={`/news/${_id}`}>
          <Card.Title>ID-{_id}</Card.Title>
        </Link>
      </Card.Body>
      <Card.Footer>
        <Stack direction="horizontal">
          Файлов: {files.length}
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            onToggle={handleChangeToggle}
            overlay={(props) => (
              <Popover id="user-popper" {...props}>
                {userData ? (
                  <>
                    <Popover.Header>{userData.name}</Popover.Header>
                    <Popover.Body>{userData.email}</Popover.Body>
                  </>
                ) : (
                  <Popover.Body>Загрузка...</Popover.Body>
                )}
              </Popover>
            )}
          >
            <div>
              <Button variant="link" type="button">
                Автор 📋
              </Button>
            </div>
          </OverlayTrigger>
        </Stack>
      </Card.Footer>
    </Card>
  );
}
