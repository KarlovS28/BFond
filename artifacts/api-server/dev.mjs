import { spawn } from "node:child_process";

function run(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      ...options,
    });

    child.on("exit", (code, signal) => {
      resolve({ code: code ?? 0, signal: signal ?? null });
    });
  });
}

const buildResult = await run("pnpm", ["run", "build"], {
  env: { ...process.env, NODE_ENV: "development" },
});

if (buildResult.code !== 0) {
  process.exit(buildResult.code);
}

const server = spawn("node", ["--enable-source-maps", "./dist/index.mjs"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  server.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

server.on("exit", (code, signal) => {
  if (signal === "SIGINT" || signal === "SIGTERM") {
    process.exit(0);
  }

  process.exit(code ?? 0);
});
