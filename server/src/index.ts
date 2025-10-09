import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://project-managment-lilac.vercel.app",
      "https://*.vercel.app"
    ], // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

// Better Auth handler - MOUNT THIS BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth)); // Express 5 uses *splat

app.use((req, res, next) => {
  // Skip JSON parsing for Better Auth routes
  if (req.path.startsWith('/api/auth/')) {
    return next();
  }
  // Use JSON parsing for all other routes
  return express.json()(req, res, next);
});
// Alternative: You can also use bodyParser with the same condition
// app.use((req, res, next) => {
//   if (req.path.startsWith('/api/auth/')) {
//     return next();
//   }
//   return bodyParser.json()(req, res, next);
// });
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(bodyParser.urlencoded({ extended: false }));


// Get user session
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

// Your other API routes
app.get("/api/protected", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  res.json({ 
    message: "Protected data", 
    user: session.user 
  });
});
/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on part ${port}`);
});