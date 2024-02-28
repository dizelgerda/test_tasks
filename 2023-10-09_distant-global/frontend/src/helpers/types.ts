export type PlainObject<T = string> = { [key: string]: T };

export type TUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type TFile = {
  _id: string;
  name: string;
  type: string;
  newsID: string;
};

export type TNews = {
  _id: string;
  text: string;
  owner: string | TUser;
  published: boolean;
  publishedAt: string;
  files: string[] | TFile[];
};
