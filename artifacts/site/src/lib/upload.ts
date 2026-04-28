import { requestUploadUrl } from "@workspace/api-client-react";

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error || data.message || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

async function uploadFileDirectly(file: File): Promise<string> {
  const directEndpoints = [
    "/api/storage/uploads/direct",
    "/api/uploads/direct",
  ];

  let lastError = "HTTP 404";

  for (const endpoint of directEndpoints) {
    const directRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-File-Name": encodeURIComponent(file.name),
      },
      body: file,
    });

    if (directRes.ok) {
      const data = (await directRes.json()) as { objectPath: string };
      return data.objectPath;
    }

    lastError = await readErrorMessage(directRes);

    if (directRes.status !== 404) {
      break;
    }
  }

  throw new Error(`Не удалось загрузить файл (${lastError})`);
}

export async function uploadFileToStorage(file: File): Promise<string> {
  try {
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
  } catch {
    return uploadFileDirectly(file);
  }
}

export function publicUrlForObject(objectPath: string | undefined | null): string {
  if (!objectPath) return "";
  if (objectPath.startsWith("http://") || objectPath.startsWith("https://")) return objectPath;
  if (objectPath.startsWith("/local-uploads/")) {
    return `/api/storage${objectPath}`;
  }
  if (objectPath.startsWith("/objects/")) {
    return `/api/storage${objectPath}`;
  }
  return objectPath;
}
