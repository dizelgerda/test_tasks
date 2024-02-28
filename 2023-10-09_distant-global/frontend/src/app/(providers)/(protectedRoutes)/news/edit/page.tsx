"use client";

import { deleteFile, uploadFiles } from "@helpers/api/files";
import { createNews, getNewsByID, updateNews } from "@helpers/api/news";
import { TNews, PlainObject, TFile } from "@helpers/types";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState, MouseEvent, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CloseButton,
  Container,
  Form,
  InputGroup,
  Stack,
} from "react-bootstrap";

const TIME_ARRAY: PlainObject<number> = {
  "10m": 10 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 1 * 60 * 60 * 1000,
  "2h": 2 * 60 * 60 * 1000,
  "5h": 5 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
};

function formatDate(date: Date): string {
  const YYYY = date.getFullYear().toString();
  let MM = (date.getMonth() + 1).toString();
  let DD = date.getDate().toString();

  [MM, DD] = [MM, DD].map((element) => {
    if (element.length === 1) return `0${element}`;
    return element;
  });

  return `${YYYY}-${MM}-${DD}`;
}

function formatTime(date: Date): string {
  let HH = date.getHours().toString();
  let MM = date.getMinutes().toString();

  [HH, MM] = [HH, MM].map((element) => {
    if (element.length === 1) return `0${element}`;
    return element;
  });

  return `${HH}:${MM}`;
}

function parseDate(dateInput: string, timeInput: string): Date {
  const date = new Date(0);

  const [YYYY, MONTH, DD] = dateInput.split("-").map((value) => Number(value));
  const [HH, MINUTES] = timeInput.split(":").map((value) => Number(value));

  date.setFullYear(YYYY, MONTH - 1, DD);
  date.setHours(HH, MINUTES);

  return date;
}

export default function EditNews() {
  const [data, setData] = useState<PlainObject<string | boolean | TFile[]>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function fetchNews(newsID: string) {
    try {
      const res = await getNewsByID(newsID);
      if (res.ok) {
        const news = (await res.json()) as TNews;
        const publishedDate = new Date(news.publishedAt);

        setData({
          newsID: news._id,
          published: news.published,
          delayed: !news.published,
          text: news.text,
          publicationDate: formatDate(publishedDate),
          publicationTime: formatTime(publishedDate),
          savedFiles: news.files as TFile[],
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const newsID = searchParams.get("newsID");
    if (newsID) {
      fetchNews(newsID);
    }
  }, []);

  useEffect(() => {
    if (!searchParams.has("newsID") && formRef.current) {
      formRef.current.reset();
      setData({});
    }
  }, [searchParams]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
  }

  function handleAddTime(e: MouseEvent<HTMLButtonElement>) {
    const { value } = e.target as HTMLButtonElement;
    let date = parseDate(
      (data.publicationDate as string) ?? formatDate(new Date()),
      (data.publicationTime as string) ?? formatTime(new Date()),
    );

    date = new Date(date.getTime() + TIME_ARRAY[value]);

    setData({
      ...data,
      publicationDate: formatDate(date),
      publicationTime: formatTime(date),
    });
  }

  function handleChecked(e: ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;

    setData({ ...data, [name]: checked });
  }

  async function handleDeleteFile(id: string) {
    try {
      const res = await deleteFile(id);

      if (res.ok) {
        const news = (await res.json()) as TNews;
        setData({ ...data, savedFiles: news.files as TFile[] });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    let publishedAt;
    const files = (e.target.elements.namedItem("files") as HTMLInputElement)
      .files as FileList;

    if (data.delayed) {
      publishedAt = parseDate(
        (e.target.elements.namedItem("publicationDate") as HTMLInputElement)
          .value,
        (e.target.elements.namedItem("publicationTime") as HTMLInputElement)
          .value,
      );
    }

    try {
      let res;
      if (data.newsID) {
        res = await updateNews(data.newsID as string, {
          text: data.text as string,
          publishedAt,
        });
      } else {
        res = await createNews({
          text: data.text as string,
          publishedAt,
        });
      }

      if (res.ok) {
        if (files && files.length) {
          const news = await res.json();
          const formData = new FormData();

          formData.set("data", [].toString());
          formData.set("names", [].toString());
          Array.from(files).forEach((file) => {
            formData.append("data", file);
            formData.append("names", file.name.toString());
          });

          await uploadFiles(formData, news._id);
        }

        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Редактор новостей</Card.Title>
          <Form id="form" ref={formRef} onSubmit={handleSubmit}>
            <Stack gap={3}>
              <Form.Group>
                <Form.Label htmlFor="text-input">Текст</Form.Label>
                <Form.Control
                  as="textarea"
                  id="text-input"
                  type="text"
                  name="text"
                  required
                  value={(data.text as string) ?? ""}
                  onChange={handleChange}
                  rows={10}
                />
                <Form.Text>Поддерживает Markdown.</Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="files-input">
                  Прикрепленные файлы
                </Form.Label>
                {data.savedFiles && (data.savedFiles as TFile[]).length ? (
                  <Stack className="mb-2" direction="horizontal" gap={2}>
                    {(data.savedFiles as TFile[]).map(({ _id, name }) => {
                      return (
                        <Card className="bg-light p-1" key={_id}>
                          <Stack direction="horizontal" gap={2}>
                            {name}{" "}
                            <CloseButton
                              value={_id}
                              onClick={() => handleDeleteFile(_id)}
                            />
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                ) : null}
                <Form.Control
                  id="files-input"
                  type="file"
                  name="files"
                  multiple
                />
              </Form.Group>

              {!data.published ? (
                <Form.Group>
                  <Form.Check
                    id="delayed-checkbox"
                    type="checkbox"
                    label="Отложенная публикация"
                    name="delayed"
                    checked={(data.delayed as boolean) ?? false}
                    onChange={handleChecked}
                  />
                  {data.delayed ? (
                    <InputGroup className="mt-2">
                      <Form.Control
                        id="date-input"
                        type="date"
                        name="publicationDate"
                        required
                        value={
                          (data.publicationDate as string) ??
                          formatDate(new Date())
                        }
                        onChange={handleChange}
                        min={formatDate(new Date())}
                      ></Form.Control>
                      <Form.Control
                        id="time-input"
                        type="time"
                        name="publicationTime"
                        required
                        value={
                          (data.publicationTime as string) ??
                          formatTime(
                            new Date(new Date().getTime() + TIME_ARRAY["10m"]),
                          )
                        }
                        onChange={handleChange}
                      ></Form.Control>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        value="30m"
                        onClick={handleAddTime}
                      >
                        +30 м
                      </Button>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        value="1h"
                        onClick={handleAddTime}
                      >
                        +1 ч
                      </Button>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        value="2h"
                        onClick={handleAddTime}
                      >
                        +2 ч
                      </Button>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        value="5h"
                        onClick={handleAddTime}
                      >
                        +5 ч
                      </Button>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        value="1d"
                        onClick={handleAddTime}
                      >
                        +1 д
                      </Button>
                    </InputGroup>
                  ) : null}
                </Form.Group>
              ) : null}
              <div>
                <Button variant="primary" type="submit">
                  Опубликовать
                </Button>
              </div>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
