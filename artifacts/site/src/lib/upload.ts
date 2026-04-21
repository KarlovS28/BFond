import { requestUploadUrl } from "@workspace/api-client-react";

export async function uploadFileToStorage(file: File): Promise<string> {
  const res = await requestUploadUrl({
    name: file.name,
    size: file.size,
    contentType: file.type || "application/octet-stream",
  });

  const putRes = await fetch(res.uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error(`Не удалось загрузить файл (HTTP ${putRes.status})`);
  }
  return res.objectPath;
}

export function publicUrlForObject(objectPath: string | undefined | null): string {
  if (!objectPath) return "";
  if (objectPath.startsWith("http://") || objectPath.startsWith("https://")) return objectPath;
  if (objectPath.startsWith("/objects/")) {
    return `/api/storage${objectPath}`;
  }
  return objectPath;
}
