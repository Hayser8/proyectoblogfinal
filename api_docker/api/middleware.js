import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const verified = jwt.verify(token, "YOUR_SECRET_KEY");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token inválido" });
  }
};

const validateBlogData = (req, res, next) => {
  const { title, content, banner } = req.body;
  if (!title || !content || (banner && banner.length > 1048576)) {
    return res
      .status(400)
      .json({
        error:
          "Missing or invalid title, content, or banner. Banner size must be under 1MB.",
      });
  }
  next();
};

export { authenticate, validateBlogData };
