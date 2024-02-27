"use client";

import Header from "@components/Header";
import { MovieData } from "@helpers/types";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Image,
  Row,
  Stack,
} from "react-bootstrap";
import * as moviesAPI from "@helpers/api";

interface MoviePageProps {
  params: {
    mdbID: string;
  };
}

export default function MoviePage({ params: { mdbID } }: MoviePageProps) {
  const { data: movieData, refetch } = useQuery({
    queryKey: ["movie", mdbID],
    queryFn: async () => {
      const { data } = await moviesAPI.getById(mdbID);
      return data as MovieData;
    },
  });

  function handleSelect(eventKey: string | null) {
    if (eventKey === "remove-action") {
      changeRating(0);
      return;
    }

    if (movieData && movieData.userSaved) {
      changeRating(Number(eventKey));
    } else {
      addMovie(Number(eventKey));
    }
  }

  async function addMovie(rating?: number) {
    await moviesAPI.add(mdbID, rating);
    refetch();
  }

  async function changeRating(newRating: number) {
    await moviesAPI.update(mdbID, newRating);
    refetch();
  }

  async function handleRemoveMovie() {
    await moviesAPI.remove(mdbID);
    refetch();
  }

  return (
    <>
      <Header />
      <Container>
        {movieData ? (
          <Row>
            <Col className=" mb-3 text-center">
              <Image
                className="shadow"
                src={movieData.Poster}
                alt="poster"
                rounded
              />
            </Col>
            <Col>
              <Stack gap={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>{movieData.Title}</Card.Title>
                    <Card.Text>{movieData.Year}</Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <Form>
                      <Stack>
                        <Form.Label>
                          Ваш рейтинг
                          {movieData.userRating ? (
                            <strong>{` ${movieData.userRating}`}</strong>
                          ) : (
                            ""
                          )}
                        </Form.Label>
                        <div>
                          <ButtonGroup size="sm">
                            {movieData.userSaved ? (
                              <Button
                                variant="outline-light"
                                type="button"
                                onClick={handleRemoveMovie}
                              >
                                Удалить
                              </Button>
                            ) : (
                              <Button
                                variant="outline-light"
                                type="button"
                                onClick={() => addMovie()}
                              >
                                Смотрел
                              </Button>
                            )}

                            <DropdownButton
                              as={ButtonGroup}
                              title="Оценить"
                              variant="outline-light"
                              onSelect={handleSelect}
                            >
                              <Dropdown.Item eventKey="1">1</Dropdown.Item>
                              <Dropdown.Item eventKey="2">2</Dropdown.Item>
                              <Dropdown.Item eventKey="3">3</Dropdown.Item>
                              <Dropdown.Item eventKey="4">4</Dropdown.Item>
                              <Dropdown.Item eventKey="5">5</Dropdown.Item>
                              {movieData.userRating ? (
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
                          </ButtonGroup>
                        </div>
                      </Stack>
                    </Form>
                  </Card.Body>
                </Card>
              </Stack>
            </Col>
          </Row>
        ) : null}
      </Container>
    </>
  );
}
