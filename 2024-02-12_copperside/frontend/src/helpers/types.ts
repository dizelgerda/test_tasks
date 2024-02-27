export type PlainObject = { [key: string]: string | number };

export interface MovieData {
  Poster: string;
  Title: string;
  imdbID: string;
  Year: string;

  userSaved: boolean;
  userRating: string | number | null;
}

export interface SearchResult {
  data: MovieData[];
  totalResults: number;
}
