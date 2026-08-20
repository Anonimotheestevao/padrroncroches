import "server-only";
import { createClient } from "@supabase/supabase-js";

// ATENÇÃO: este arquivo só pode ser importado por código de servidor
// (funções dentro de src/lib/server/ ou server/routes/). A "service role key"
// ignora todas as regras de segurança (RLS) do banco — se ela vazar para o
// navegador do cliente, qualquer pessoa pode ler/editar/apagar QUALQUER dado
// de QUALQUER usuário. O import "server-only" acima faz o build falhar caso
// algum componente de cliente tente importar este arquivo por engano.

const supabaseUrl = process.env["VITE_SUPABASE_URL"];
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "[Supabase Admin] VITE_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY não configurados. " +
      "Checkout e webhook de pagamento não vão funcionar até preencher o .env.",
  );
}

export const supabaseAdmin = createClient(supabaseUrl ?? "", serviceRoleKey ?? "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
