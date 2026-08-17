import { useState, type FormEvent } from "react";
import { Loader2, Lock, LogOut, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

export function AccountDrawer() {
  const { user, isOpen, close, mode, setMode, signIn, signUp, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result =
      mode === "login" ? await signIn(email, password) : await signUp(email, password, fullName);

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      resetForm();
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
          resetForm();
        }
      }}
    >
      <SheetContent className="flex h-full w-[90%] max-w-[420px] flex-col overflow-hidden rounded-l-3xl border-l-0 p-0 shadow-2xl inset-y-0 right-0 duration-300 animate-in slide-in-from-right">
        <div className="flex h-full flex-col bg-white">
          <SheetHeader className="flex flex-row items-center justify-between border-b px-6 py-6 shrink-0">
            <SheetTitle className="font-display text-2xl font-black tracking-tight text-slate-900">
              {user ? "Minha conta" : mode === "login" ? "Entrar" : "Criar conta"}
            </SheetTitle>
          </SheetHeader>

          {user ? (
            <div className="flex-1 px-6 py-6">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {(user.user_metadata?.["full_name"] as string | undefined) || "Sem nome cadastrado"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOut()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-destructive px-4 py-3 text-sm font-bold text-destructive transition hover:bg-destructive hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            </div>
          ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Alternância Entrar / Criar conta */}
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("cadastro");
                  setError(null);
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  mode === "cadastro" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Criar conta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "cadastro" && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome"
                      className="h-11 pl-9"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className="h-11 pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pl-9"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-display text-base font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20 transition hover:bg-brand-deep active:scale-[0.98] disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
              {mode === "login" ? (
                <>
                  Ainda não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("cadastro")}
                    className="font-bold text-brand hover:underline"
                  >
                    Criar conta
                  </button>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-brand hover:underline"
                  >
                    Entrar
                  </button>
                </>
              )}
            </p>
          </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
