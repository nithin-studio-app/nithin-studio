import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Point a sub-app's package specifier at its local repo's src during
// development (e.g. LOCAL_FILEZILLA=../filezilla/src) to get full HMR
// without needing to publish first. Unset, this map is empty and every
// sub-app resolves normally from node_modules.
const localAliases: Record<string, string> = {};
if (process.env.LOCAL_FILEZILLA) {
  localAliases["@nithin-studio-app/filezilla"] = resolve(process.env.LOCAL_FILEZILLA);
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: localAliases,
  },
  server: {
    // Vite refuses to serve files outside the project root by default —
    // needed since the aliased path lives in a sibling repo.
    fs: {
      allow: [".", "../filezilla"],
    },
  },
});
