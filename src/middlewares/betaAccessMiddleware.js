/**
 * src/middlewares/betaAccessMiddleware.js
 *
 * Middleware de Proteção Beta.
 * Protege o site com senha durante a fase de testes (beta),
 * exceto rotas públicas e arquivos estáticos.
 *
 * Regras:
 * - Permite rotas públicas (lista abaixo)
 * - Permite arquivos estáticos (css/js/img/fonts)
 * - Permite acesso se req.session.betaAccess === true
 * - Caso contrário redireciona para /beta-login
 */

const betaAccessMiddleware = (req, res, next) => {
  // Lista de rotas públicas (prefixos)
  const publicRoutes = [
    '/beta-access',   // POST de envio da senha
    '/beta-login',    // página de login beta
    '/beta-logout',   // logout beta
    '/public',        // rotas públicas do site (se houver)
    '/c',             // rota curta pública (ex: /c/:slug)
    '/api/health'     // health-checks
  ];

  // Verificar se é rota pública - startsWith para suportar subpaths
  const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));

  // Liberar arquivos estáticos (extensões comuns)
  const isStaticFile = !!req.path.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf)$/i);

  if (isPublicRoute || isStaticFile) {
    return next();
  }

  // Verificar se sessão indica acesso liberado
  if (req.session && req.session.betaAccess) {
    return next();
  }

  // Caso não autorizado: redirecionar para login beta
  return res.redirect('/beta-login');
};

module.exports = betaAccessMiddleware;
