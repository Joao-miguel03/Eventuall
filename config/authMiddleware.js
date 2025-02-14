const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.session.token || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  jwt.verify(token, 'secreta', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.user = decoded; // Armazenar dados do usuário decodificados
    next();
  });
};

// Função para verificar o papel do usuário
const authorizeRole = (roleRequired) => {
  return (req, res, next) => {
    if (!req.user || req.user.role != roleRequired) {
      return res.status(403).json({ message: 'Permissão negada' });
    }
    next();
  };
};

// Exporta as funções corretamente
module.exports = {
  authenticate,
  authorizeRole
};
