module.exports = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Accès refusé : autorisation insuffisante" });
    }
    next();
  };
};
