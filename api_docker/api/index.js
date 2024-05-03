import express from "express";
import cors from "cors";
import { loginUser, registerUser } from "./auth.js";
import { logRequest } from "./logging.js";
import { authenticate, validateBlogData } from "./middleware.js";
import {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogById,
} from "./db.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use(logRequest);

const corsOptions = {
  origin: "http://18.220.89.49:6900",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

console.log("enable Cors");
app.use(cors(corsOptions));

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const token = await loginUser(username, password);
  if (token) {
    res.json({ token: token, message: "Autenticado correctamente" });
  } else {
    res.status(400).json({ error: "Usuario o contraseña incorrectos" });
  }
});

app.post("/admin/register", async (req, res) => {
  const { username, password } = req.body;
  const result = await registerUser(username, password);
  if (result) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.use("/admin", authenticate);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening at http://127.:${port}`);
});

app.post("/blogs", validateBlogData, async (req, res) => {
  try {
    const blogs = await createBlog(
      req.body.title,
      req.body.content,
      req.body.banner
    );
    res.json(blogs);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/blogs", async (req, res) => {
  const blogs = await getAllBlogs();
  res.json(blogs);
});

app.get("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await getBlogById(id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// app.post('/start', async (req, res) => {
//   const messages = await createDatabase()
//   res.json(messages)
// })

app.put("/blogs/:id", validateBlogData, async (req, res) => {
  try {
    const result = await updateBlog(
      req.params.id,
      req.body.title,
      req.body.content,
      req.body.banner
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/blogs/:id", async (request, response) => {
  const id = request.params.id;
  console.log(id);
  await deleteBlog(id);
  response.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
app.use((req, res, next) => {
  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method)) {
    return res.status(501).json({ error: "Method not implemented" });
  }
  next();
});
