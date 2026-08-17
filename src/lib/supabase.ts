import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

// Em desenvolvimento, avisa claramente no console se as chaves não foram configuradas,
// em vez de deixar o app quebrar silenciosamente em algum clique de "Entrar".
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não configurados. " +
      "Cadastro, login e pedidos não vão funcionar até você preencher o arquivo .env " +
      "com as chaves do seu projeto Supabase (veja .env.example).",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
