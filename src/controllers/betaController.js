/**
 * src/controllers/betaController.js
 *
 * Controller para acesso beta (render + processar senha + logout)
 *
 * Observações:
 * - A senha BETA vem de process.env.BETA_PASSWORD
 * - Nunca commite o .env com valores reais
 */

const BETA_PASSWORD = process.env.BETA_PASSWORD || 'ocyan2025beta';

/**
 * Renderiza a página de login beta (HTML inline simples)
 */
exports.renderBetaLogin = (req, res) => {
  const error = req.query.error;

  // Retornamos HTML diretamente (simples, sem template engine)
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ocyan-Tech - Acesso Beta</title>
      <style>
        /* estilos mínimos e bonitos para a tela de beta */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        h1 { font-size: 42px; margin-bottom: 10px;
             background: linear-gradient(135deg, #667eea, #764ba2);
             -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: #666; margin-bottom: 30px; font-size: 18px; }
        .badge { display:inline-block; background:#FCD34D; color:#92400E; padding:8px 20px; border-radius:20px; font-weight:bold; margin-bottom:30px; }
        input { width:100%; padding:15px 20px; border:2px solid #e5e7eb; border-radius:10px; font-size:16px; margin-bottom:20px; transition:border 0.3s; }
        input:focus { outline:none; border-color:#667eea; }
        button { width:100%; padding:15px; background:linear-gradient(135deg,#667eea,#764ba2); color:white; border:none; border-radius:10px; font-size:18px; font-weight:bold; cursor:pointer; }
        .error { background:#fee2e2; color:#dc2626; padding:12px; border-radius:8px; margin-bottom:20px; font-size:14px; }
        .info { margin-top:30px; padding-top:30px; border-top:1px solid #e5e7eb; color:#666; font-size:14px; }
        .rocket{ font-size:60px; margin-bottom:20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="rocket">🚀</div>
        <h1>Ocyan-Tech</h1>
        <p class="subtitle">Automação de Atendimento para Negócios</p>
        <div class="badge">🔒 ACESSO BETA</div>

        ${error ? '<div class="error">❌ Senha incorreta. Tente novamente.</div>' : ''}

        <form method="POST" action="/beta-access">
          <input type="password" name="password" placeholder="Digite a senha de acesso" required autofocus>
          <button type="submit">Acessar Plataforma</button>
        </form>

        <div class="info">
          <p><strong>Fase Beta - Acesso Restrito</strong></p>
          <p style="margin-top:10px;">Estamos em fase de testes com clientes selecionados. Em breve disponível para todos!</p>
        </div>
      </div>
    </body>
    </html>
  `);
};

/**
 * Processa o login beta (compara senha vindo do form)
 */
exports.processBetaAccess = (req, res) => {
  const { password } = req.body;

  if (password === BETA_PASSWORD) {
    // Senha correta - marca sessão como liberada
    req.session.betaAccess = true;
    return res.redirect('/');
  }

  // Senha incorreta
  return res.redirect('/beta-login?error=1');
};

/**
 * Logout beta (remove acesso)
 */
exports.betaLogout = (req, res) => {
  if (req.session) {
    req.session.betaAccess = false;
  }
  res.redirect('/beta-login');
};

