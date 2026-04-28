import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import fs from "node:fs/promises";
import path from "node:path";
import router from "./routes";
import { logger } from "./lib/logger";
import { ensureAdminUser, pruneExpiredSessions } from "./lib/auth";
import { seedIfEmpty } from "./lib/seed";

const app: Express = express();
const isDevelopment = process.env.NODE_ENV === "development";
const siteRoot = path.resolve(import.meta.dirname, "../../site");
const siteDistRoot = path.resolve(siteRoot, "dist/public");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

async function setupFrontend(): Promise<void> {
  if (isDevelopment) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      appType: "custom",
      root: siteRoot,
      server: {
        middlewareMode: true,
        hmr: false,
      },
    });

    app.use(vite.middlewares);
    app.use(async (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }

      try {
        const templatePath = path.resolve(siteRoot, "index.html");
        const template = await fs.readFile(templatePath, "utf8");
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).type("html").send(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
    return;
  }

  app.use(express.static(siteDistRoot));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    res.sendFile(path.resolve(siteDistRoot, "index.html"));
  });
}

await setupFrontend();

ensureAdminUser().catch((err) => logger.error({ err }, "Failed to seed admin user"));
pruneExpiredSessions().catch(() => undefined);
seedIfEmpty().catch((err) => logger.error({ err }, "Failed to seed initial data"));

export default app;
