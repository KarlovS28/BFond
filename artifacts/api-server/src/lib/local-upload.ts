import fs from "node:fs/promises";
import syncFs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const LOCAL_UPLOAD_PREFIX = "/local-uploads";

function findWorkspaceRoot(): string {
  let currentDir = process.cwd();

  while (true) {
    if (
      syncFs.existsSync(path.join(currentDir, "pnpm-workspace.yaml")) ||
      syncFs.existsSync(path.join(currentDir, ".env"))
    ) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return process.cwd();
    }
    currentDir = parentDir;
  }
}

const WORKSPACE_ROOT = findWorkspaceRoot();
const LOCAL_UPLOADS_DIR = path.resolve(WORKSPACE_ROOT, ".local/uploads");

function sanitizeExtension(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  return /^[.\w-]{0,16}$/.test(ext) ? ext : "";
}

export async function saveLocalUpload(
  fileName: string,
  content: Buffer,
): Promise<string> {
  const now = new Date();
  const monthDir = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const ext = sanitizeExtension(fileName);
  const objectName = `${randomUUID()}${ext}`;
  const targetDir = path.join(LOCAL_UPLOADS_DIR, monthDir);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, objectName), content);

  return `${LOCAL_UPLOAD_PREFIX}/${monthDir}/${objectName}`;
}

export async function readLocalUpload(pathname: string): Promise<Buffer> {
  const relativePath = pathname.replace(/^\/+/, "");
  const absolutePath = path.resolve(LOCAL_UPLOADS_DIR, relativePath.replace(/^local-uploads\/?/, ""));

  if (!absolutePath.startsWith(LOCAL_UPLOADS_DIR)) {
    throw new Error("Invalid local upload path");
  }

  return fs.readFile(absolutePath);
}
