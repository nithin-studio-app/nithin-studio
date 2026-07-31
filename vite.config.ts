import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

interface LocalOverride {
  enabled: boolean;
  path: string;
}

// Point a sub-app's package specifier at its sibling repo's src during
// development, to get full HMR without needing to publish first. Configured
// via a gitignored local.config.json, e.g. { "filezilla": { "enabled":
// true, "path": "../filezilla/src" } } — each developer's setup stays out
// of git, so anyone without that file (including CI) resolves every
// sub-app normally from node_modules, same as a real published dependency.
function loadLocalAliases(): Record<string, string> {
  const configPath = resolve(__dirname, "local.config.json");
  if (!existsSync(configPath)) return {};
  const config = JSON.parse(readFileSync(configPath, "utf-8")) as Record<string, LocalOverride>;
  const aliases: Record<string, string> = {};
  for (const [pkg, override] of Object.entries(config)) {
    if (override.enabled) aliases[`@nithin-studio-app/${pkg}`] = resolve(__dirname, override.path);
  }
  return aliases;
}

const localAliases = loadLocalAliases();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: localAliases,
  },
  server: {
    // Vite refuses to serve files outside the project root by default —
    // needed since an aliased path can point outside it (e.g. a sibling
    // repo). Derived from the same config so any path in local.config.json
    // (relative or absolute) is automatically allowed, not just filezilla.
    fs: {
      allow: [".", ...Object.values(localAliases)],
    },
  },
});
