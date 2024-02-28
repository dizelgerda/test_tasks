import { logout } from "@helpers/api/users";
import { useAppDispatch } from "@helpers/store/hooks";
import { removeCurrentUser } from "@helpers/store/slices/currentUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Container, Navbar, Stack } from "react-bootstrap";

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function handleLogout() {
    const res = await logout();
    if (res.ok) {
      dispatch(removeCurrentUser());
      router.push("/sign-in");
    }
  }

  return (
    <Navbar className="bg-light mb-4">
      <Container>
        <Stack direction="horizontal" gap={2}>
          <Link href="/">
            <Button variant="link" type="button">
              Новостная лента
            </Button>
          </Link>
          <Link href="/news/edit">
            <Button variant="outline-success" type="button">
              Добавить новость
            </Button>
          </Link>
        </Stack>

        <Stack direction="horizontal" gap={2}>
          <Link href="/profile">
            <Button variant="link" type="button">
              Профиль
            </Button>
          </Link>

          <Button
            variant="outline-secondary"
            type="button"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Stack>
      </Container>
    </Navbar>
  );
}
