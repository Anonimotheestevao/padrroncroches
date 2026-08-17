import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, Search, ShoppingBag, Heart, X, User } from "lucide-react";
import logo from "@/assets/logo-padrron.png";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { SearchOverlay } from "@/components/SearchOverlay";

const links = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, toggle } = useCart();
  const { user, open: openAuth, signOut } = useAuth();


  return (
    <header className="sticky top-0 z-30 bg-background">
      <div className="bg-brand px-4 py-2 text-center text-xs font-extrabold uppercase tracking-wide text-primary-foreground sm:text-sm">
        🎁 Compre 2 & Ganhe 1 Grátis — Pague 2, Leve 3 ✨
      </div>

      <div className="relative flex items-center justify-between border-b border-border px-4 py-3">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          className="text-foreground"
        >
          <Menu className="h-7 w-7" strokeWidth={2.5} />
        </button>

        <Link to="/" className="flex flex-col items-center gap-1">
          <img src={logo} alt="PadrronCroche" width={512} height={512} className="h-12 w-auto" />
          <span className="font-display text-sm font-extrabold uppercase leading-none text-brand">
            PadrronCroche
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Feito à mão
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Heart className="hidden h-6 w-6 sm:block" />
          <button
            type="button"
            aria-label={user ? "Minha conta" : "Entrar"}
            onClick={() => openAuth("login")}
            className="hidden outline-none sm:block"
          >
            <User className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Buscar produtos"
            onClick={() => setSearchOpen(true)}
            className="outline-none"
          >
            <Search className="h-6 w-6" />
          </button>

          <button onClick={toggle} className="relative outline-none">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <nav className="h-full w-[85%] max-w-sm bg-background shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-display text-lg font-extrabold uppercase tracking-wide">
                Explorar
              </span>
              <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="border-t border-border">
              {links.map((l) => (
                <li key={l.to} className="border-b border-border">
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-muted text-brand" }}
                    className="block px-5 py-3 text-base"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {user ? (
              <div className="border-t border-border px-5 py-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Logado como</p>
                <p className="mt-0.5 truncate text-sm font-bold text-slate-900">
                  {(user.user_metadata?.["full_name"] as string | undefined) || user.email}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="mt-3 flex items-center gap-2 text-sm font-bold text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sair da conta
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  openAuth("login");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 border-t border-border px-5 py-4 text-sm font-bold"
              >
                <User className="h-5 w-5" />
                Entrar
              </button>
            )}
          </nav>
          <button
            type="button"
            aria-label="Fechar menu"
            className="h-full flex-1 bg-brand-deep/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>

  );
}
