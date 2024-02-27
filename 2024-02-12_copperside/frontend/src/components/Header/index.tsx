"use client";

import Link from "next/link";
import { Button, Container, Navbar, Stack } from "react-bootstrap";

export default function Header() {
  return (
    <Container className="bg-dark mb-5" fluid>
      <Navbar className="bg-dark">
        <Container>
          <Stack direction="horizontal" gap={2}>
            <Navbar.Brand>
              <h1 className="m-0">Movie HUB</h1>
            </Navbar.Brand>
            <Link href="/" className="me-auto">
              <Button type="button" variant="link">
                Поиск
              </Button>
            </Link>
          </Stack>

          <Link href="/profile">
            <Button type="button" variant="outline-light">
              Профиль
            </Button>
          </Link>
        </Container>
      </Navbar>
    </Container>
  );
}
