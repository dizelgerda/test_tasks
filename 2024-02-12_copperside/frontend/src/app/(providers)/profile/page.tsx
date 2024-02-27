"use client";

import Header from "@components/Header";
import MovieCard from "@components/MovieCard";
import * as moviesAPI from "@helpers/api";
import { MovieData } from "@helpers/types";
import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "react-bootstrap";

export default function ProfilePage() {
  const { data: moviesData, refetch } = useQuery({
    queryKey: ["savedMovies"],
    queryFn: async () => {
      const { data } = await moviesAPI.getAll();
      return (data as MovieData[]).reverse();
    },
  });

  async function handleChangeRating(mdbID: string, newRating: number) {
    await moviesAPI.update(mdbID, newRating);
    refetch();
  }

  async function handleRemoveMovie(mdbID: string) {
    await moviesAPI.remove(mdbID);
    refetch();
  }

  return (
    <>
      <Header />
      <Container>
        {moviesData && Array.isArray(moviesData) ? (
          <>
            <p>Сохранено фильмов: {moviesData.length}</p>
            <Row>
              {moviesData.map(
                ({ imdbID, Poster, Title, Year, userSaved, userRating }) => {
                  return (
                    <Col key={imdbID} className="mb-4" sm={12} md={4} lg={3}>
                      <MovieCard
                        id={imdbID}
                        poster={Poster}
                        name={Title}
                        year={Year}
                        saved={userSaved}
                        rating={userRating}
                        onUpdate={handleChangeRating}
                        onRemove={handleRemoveMovie}
                      />
                    </Col>
                  );
                },
              )}
            </Row>
          </>
        ) : null}
      </Container>
    </>
  );
}
