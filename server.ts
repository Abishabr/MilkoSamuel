import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db, hashPassword } from "./server/db.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request bodies
  app.use(express.json());

  // ---------------- AUTHENTICATION API ----------------
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const users = db.getTable("users");
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.password === hashPassword(password)) {
      // Simple mock session token
      const token = `session_${user.id}_${Date.now()}`;
      return res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    }

    return res.status(401).json({ error: "Invalid email or password" });
  });

  // ---------------- GLOBAL SETTINGS API ----------------
  app.get("/api/settings", (req, res) => {
    const settings = db.getSettings();
    res.json(settings);
  });

  app.put("/api/settings", (req, res) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // ---------------- UNIVERSAL CRUD ENDPOINTS MAKER ----------------
  const makeCrudRoutes = (resourceName: string) => {
    // GET all
    app.get(`/api/${resourceName}`, (req, res) => {
      const items = db.getTable(resourceName);
      // Optional sorting if items have "order" property
      if (items.length > 0 && items[0].order !== undefined) {
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      res.json(items);
    });

    // POST create
    app.post(`/api/${resourceName}`, (req, res) => {
      const created = db.insert(resourceName, req.body);
      res.status(201).json(created);
    });

    // PUT update
    app.put(`/api/${resourceName}/:id`, (req, res) => {
      const { id } = req.params;
      const updated = db.update(resourceName, id, req.body);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ error: `Resource not found in ${resourceName}` });
      }
    });

    // DELETE
    app.delete(`/api/${resourceName}/:id`, (req, res) => {
      const { id } = req.params;
      const deleted = db.delete(resourceName, id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: `Resource not found in ${resourceName}` });
      }
    });
  };

  // Create standard CRUD endpoints for all our dynamic portfolio structures
  const resources = [
    "users",
    "categories",
    "projects",
    "project_images",
    "services",
    "skills",
    "experiences",
    "messages",
    "social_links",
    "process_steps",
    "philosophy_items"
  ];

  resources.forEach(makeCrudRoutes);

  // Special additional parameters or actions for messages (e.g. submitting a new message)
  // Our generic POST /api/messages handles creation, which is perfect for public contact submissions.

  // ---------------- VITE MIDDLEWARE SETUP ----------------
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static files serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Express server failed to start:", err);
});
