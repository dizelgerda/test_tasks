"use client";

import Header from "@components/Header";
import { MovieData, SearchResult } from "@helpers/types";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import _ from "lodash";
import { useQuery } from "@tanstack/react-query";
import * as moviesAPI from "@helpers/api";
import MovieCard from "@components/MovieCard";

const COUNT_PER_PAGE = 10;

export default function MainPage() {
  const [searchLine, setSearchLine] = useState<string>();
  const [content, setContent] = useState<MovieData[]>([]);
  const [page, setPage] = useState(1);
  const [movieIdForUpdate, setMovieIdForUpdate] = useState<string>();
  const [isSearching, setIsSearching] = useState(false);

  const { data: moviesData, refetch } = useQuery({
    queryKey: ["searchedMovies", page],
    queryFn: async () => {
      if (!searchLine) {
        return null;
      }

      const { data } = await moviesAPI.search(searchLine, page);
      setContent((content) => content.concat((data as SearchResult).data));
      setIsSearching(false);
      return data;
    },
  });
  const debouncedRefetch = useCallback(_.debounce(refetch, 1000), []);

  useQuery({
    queryKey: ["movie", movieIdForUpdate],
    queryFn: async () => {
      if (!movieIdForUpdate) {
        return null;
      }

      const { data } = await moviesAPI.getById(movieIdForUpdate as string);
      setContent((content) => {
        const index = content.findIndex((movie) => {
          return movie.imdbID === (data as MovieData).imdbID;
        });

        content[index] = data;
        return Array.from(content);
      });
      setMovieIdForUpdate("");
      return data;
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollMax = document.body.offsetHeight;

      if (
        scrollMax - scrollPosition < 400 &&
        moviesData &&
        Math.floor(moviesData.totalResults / COUNT_PER_PAGE) > page
      ) {
        setPage((page) => ++page);
      }
    };

    const throttledHandleScroll = _.throttle(handleScroll, 500);

    window.addEventListener("scroll", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [moviesData]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSearchLine(value);

    setPage(1);
    setContent([]);
    setIsSearching(true);

    debouncedRefetch();
  }

  async function handleAddMovie(mdbID: string, rating?: number) {
    await moviesAPI.add(mdbID, rating);
    setMovieIdForUpdate(mdbID);
  }

  async function handleChangeRating(mdbID: string, newRating: number) {
    await moviesAPI.update(mdbID, newRating);
    setMovieIdForUpdate(mdbID);
  }

  async function handleRemoveMovie(mdbID: string) {
    await moviesAPI.remove(mdbID);
    setMovieIdForUpdate(mdbID);
  }

  return (
    <>
      <Header />
      <Container>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              type="text"
              name="movie_search_input"
              placeholder="Найти фильм"
              onChange={handleChange}
              value={searchLine ?? ""}
            />
          </Form.Group>
        </Form>

        {isSearching ? (
          <p>Поиск...</p>
        ) : (
          <p>
            Найдено фильмов:
            {moviesData ? <strong> {moviesData.totalResults}</strong> : null}
          </p>
        )}

        {content ? (
          <>
            <Row>
              {content.map(
                ({ imdbID, Poster, Title, Year, userRating, userSaved }) => {
                  return (
                    <Col key={imdbID} className="mb-4" sm={12} md={4} lg={3}>
                      <MovieCard
                        id={imdbID}
                        poster={Poster}
                        name={Title}
                        year={Year}
                        saved={userSaved}
                        rating={userRating}
                        onRemove={handleRemoveMovie}
                        onAdd={handleAddMovie}
                        onUpdate={handleChangeRating}
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
