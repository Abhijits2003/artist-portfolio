
module.exports = (req, res, next) => {
  const key = process.env.ADMIN_KEY;
  if (!key) return next();
  if (req.get('x-admin-key') === key) return next();
  return res.status(401).json({ message: 'Admin key required.' });
};
