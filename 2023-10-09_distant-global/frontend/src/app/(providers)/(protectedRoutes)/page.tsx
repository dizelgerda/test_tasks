"use client";

import NewsData from "@components/NewsData";
import { getAllNews } from "@helpers/api/news";
import { TNews } from "@helpers/types";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

export default function Home() {
  const [data, setData] = useState<TNews[]>([]);

  async function fetchData() {
    try {
      const res = await getAllNews();
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center" lg="auto">
        {data.length
          ? data.map((news) => {
              return (
                <Col className="mb-3" key={news._id}>
                  <NewsData {...news} />
                </Col>
              );
            })
          : null}
      </Row>
    </Container>
  );
}
