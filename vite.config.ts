// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // O projeto é hospedado no Vercel, não no Cloudflare (que é o padrão desta config).
  // Sem isso, o build gera Workers do Cloudflare, e as rotas de servidor (checkout,
  // webhook do Mercado Pago) não funcionam quando publicadas no Vercel.
  nitro: {
    preset: "vercel",
    // "serverDir" funciona em runtime (habilita as rotas nativas em server/routes/,
    // como o webhook do Mercado Pago) mas não está no tipo TS desta versão do pacote.
    ...({ serverDir: "server" } as Record<string, unknown>),
  },
});
