const BASE_URL = "http://localhost:3000";

export function uploadFiles(files: FormData, newsID: string) {
  return fetch(`${BASE_URL}/news/${newsID}/files`, {
    method: "POST",
    credentials: "include",
    body: files,
  });
}

export function deleteFile(id: string) {
  return fetch(`${BASE_URL}/files/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}
