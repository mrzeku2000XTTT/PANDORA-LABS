import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Pandora Node" });
  });

  app.post("/api/compile", (req, res) => {
    const { code, type } = req.body;
    
    // Simulate compilation delay
    setTimeout(() => {
      if (!code || code.trim() === "") {
        return res.status(400).json({ error: "No code provided for compilation." });
      }

      // Simple mock validation for KRC-20 JSON structure
      if (type === "KRC-20") {
        try {
          const parsed = JSON.parse(code);
          if (!parsed.p || parsed.p !== "krc-20") {
            return res.status(400).json({ error: "Invalid KRC-20 protocol definition." });
          }
          if (!parsed.op || !["deploy", "mint", "transfer"].includes(parsed.op)) {
            return res.status(400).json({ error: "Invalid or missing operation (op)." });
          }
        } catch (e) {
          return res.status(400).json({ error: "Invalid JSON format for KRC-20 code." });
        }
      }

      res.json({
        success: true,
        bytecode: Buffer.from(code).toString('hex'),
        message: "Compilation successful."
      });
    }, 1500);
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
