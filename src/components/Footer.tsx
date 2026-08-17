import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-tint">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="font-display text-xl font-extrabold text-brand-deep">PadrronCroche</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Padrões de crochê digitais em PDF para download imediato, feitos para inspirar o seu
          próximo projeto artesanal.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-brand-deep">
              Navegar
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-brand">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-brand">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-brand">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-brand-deep">
              Atendimento
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Todos os pedidos são digitais</li>
              <li>Suporte em até 24 horas</li>
              <li>contato@padrroncroche.com</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} PadrronCroche. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
