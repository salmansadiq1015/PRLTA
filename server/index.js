import express from "express";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/authRoutes.js";
import blogsRoutes from "./routes/blogRoutes.js";
import galleryRoutes from "./routes/GalleryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import catchRoutes from "./routes/catchRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import fishingSpotRoute from "./routes/fishingSpotRoute.js";
import issuesRoutes from "./routes/issuesRoute.js";

import http from "http";
import { initialSocketServer } from "./socketServer.js";

// Dotenv Config
dotenv.config();

// Database Config
connectDB();

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Swagger Options

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trust Market Project API",
      version: "1.0.0",
      description: "API documentation for Trust Market Project",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      securitySchemes: {
        tokenAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Enter your token without the Bearer prefix",
        },
      },
    },
    security: [
      {
        tokenAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// Initialize Swagger JSDoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Socket Server
const server = http.createServer(app);
initialSocketServer(server);

// Rest API's
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blogs", blogsRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/catches", catchRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/fishingSpot", fishingSpotRoute);
app.use("/api/v1/issues", issuesRoutes);

app.use("/", (req, res) => {
  res.send("Server is running...");
});

// Linten
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`.bgMagenta.white);
});
