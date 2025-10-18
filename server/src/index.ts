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
import multer from "multer";
import { updateUser } from "./controllers/userController"; "../controllers/userController";

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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: [ "Set-Cookie"],
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


app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(bodyParser.urlencoded({ extended: false }));


// Get user session
app.get("/api/me", async (req, res) => {
  try {
     console.log('🔍 /api/me called with cookies:', req.headers.cookie);
      console.log('🌐 Origin:', req.headers.origin);
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    console.log('👤 Session data:', session);
     // Add CORS headers explicitly
      return res.json(session);
  } catch (error) {
    console.error('💥 Error in /api/me:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Your other API routes

/* ROUTES */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
app.get("/", (req, res) => {
  res.send("This is home route");
});
app.patch("/users/:id", upload.single('profilePicture'), updateUser);
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