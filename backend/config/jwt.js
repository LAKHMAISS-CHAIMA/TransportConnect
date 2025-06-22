module.exports = {
  secret: process.env.JWT_SECRET || 'votre_secret_par_defaut',
  expiresIn: '7d',
};
