import Link from "next/link";

export const metadata = {
  title: "INSÔNIA | Minha conta"
};

export default function AccountPage() {
  return (
    <div className="account-page">
      <section className="account-hero shell">
        <p className="eyebrow">Área do cliente</p>
        <div className="account-hero-grid">
          <div>
            <h1 className="account-title">Cadastro do cliente</h1>
            <p className="account-description">
              Crie sua conta para manter seus dados salvos e acessar a experiência personalizada da INSÔNIA.
            </p>
          </div>
          <div className="account-status">
            <span>Status da conta</span>
            <strong>Conta ativa</strong>
            <p>Gerencie seu cadastro e acompanhe suas compras em um só lugar.</p>
            <Link className="account-status-link" href="/meus-pedidos">Ver meus pedidos</Link>
          </div>
        </div>
      </section>

      <section className="account-layout shell">
        <div className="account-panel account-form-panel">
          <div className="panel-heading">
            <span>Novo cliente</span>
            <h2>Criar cadastro</h2>
          </div>

          <form className="customer-form" action="/minha-conta">
            <label>
              Nome completo
              <input type="text" name="nome" placeholder="Seu nome" autoComplete="name" />
            </label>
            <label>
              E-mail
              <input type="email" name="email" placeholder="voce@email.com" autoComplete="email" />
            </label>
            <label>
              Telefone
              <input type="tel" name="telefone" placeholder="(00) 00000-0000" autoComplete="tel" />
            </label>
            <label>
              Senha
              <input type="password" name="senha" placeholder="Crie uma senha" autoComplete="new-password" />
            </label>

            <Link className="button button-primary" href="/meus-pedidos">Criar minha conta</Link>
          </form>
        </div>

        <div className="account-panel login-panel">
          <div className="panel-heading">
            <span>Já tenho conta</span>
            <h2>Acessar conta</h2>
          </div>

          <form className="customer-form compact-form" action="/minha-conta">
            <label>
              E-mail
              <input type="email" name="login-email" placeholder="voce@email.com" autoComplete="email" />
            </label>
            <label>
              Senha
              <input type="password" name="login-senha" placeholder="Sua senha" autoComplete="current-password" />
            </label>

            <Link className="button" href="/meus-pedidos">Entrar</Link>
          </form>
        </div>
      </section>
    </div>
  );
}
