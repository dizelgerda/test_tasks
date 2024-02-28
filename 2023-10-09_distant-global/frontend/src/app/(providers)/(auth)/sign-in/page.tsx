"use client";

import { login } from "@helpers/api/users";
import { useAppDispatch } from "@helpers/store/hooks";
import { setCurrentUser } from "@helpers/store/slices/currentUser";
import { PlainObject } from "@helpers/types";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Card, Form, Stack } from "react-bootstrap";

export default function SignIn() {
  const [data, setData] = useState<PlainObject>({});
  const dispatch = useAppDispatch();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await login(data.email, data.password);
      if (res.ok) {
        const user = await res.json();
        dispatch(setCurrentUser(user));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Вход</Card.Title>
        <Form className="mt-4" onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Form.Group>
              <Form.Label htmlFor="email-input">Email</Form.Label>
              <Form.Control
                id="email-input"
                name="email"
                type="email"
                required
                value={data.email ?? ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="password-input">Пароль</Form.Label>
              <Form.Control
                id="password-input"
                name="password"
                type="password"
                required
                value={data.password ?? ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Stack direction="horizontal">
              <Button variant="primary" type="submit">
                Войти
              </Button>

              <Button variant="link" type="button">
                <Link href="/sign-up">Зарегистрироваться</Link>
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Card.Body>
    </Card>
  );
}
