"use client";

import { createUser } from "@helpers/api/users";
import { PlainObject } from "@helpers/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { Card, Form, Stack, Button, Row, Col } from "react-bootstrap";

export default function SignUp() {
  const [data, setData] = useState<PlainObject>({});
  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res.ok) {
        router.push("sign-in");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Регистрация</Card.Title>
        <Form className="mt-4" onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Form.Group>
              <Form.Label htmlFor="name-input">Имя</Form.Label>
              <Form.Control
                id="name-input"
                name="name"
                type="text"
                required
                value={data.name ?? ""}
                onChange={handleChange}
              />
            </Form.Group>

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
              <Row>
                <Col>
                  <Form.Control
                    id="password-input"
                    name="password"
                    type="password"
                    required
                    value={data.password ?? ""}
                    onChange={handleChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    id="repeatedPassword-input"
                    name="repeatedPassword"
                    type="password"
                    required
                    value={data.repeatedPassword ?? ""}
                    onChange={handleChange}
                    isInvalid={data.password !== data.repeatedPassword}
                  />
                  {data.password !== data.repeatedPassword ? (
                    <Form.Control.Feedback type="invalid">
                      Пароли не совпадают.
                    </Form.Control.Feedback>
                  ) : null}
                </Col>
              </Row>
            </Form.Group>
            <Stack direction="horizontal">
              <Button
                variant="primary"
                type="submit"
                disabled={data.password !== data.repeatedPassword}
              >
                Зарегистрироваться
              </Button>

              <Button variant="link" type="button">
                <Link href="/sign-in">Войти</Link>
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Card.Body>
    </Card>
  );
}
