import * as dotenv from "dotenv";
dotenv.config();

import path from "path";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { databaseConnection } from "./config/database";
import { shouldCompress } from "./config/compression";
import { errorHandler } from "./middlewares/errorHandler";
import plabRoutes from "./routes/plabRoutes";
import superAdminRoutes from "./routes/superAdminRoutes";
import userRoutes from "./routes/userRoutes";
import trustRoutes from "./routes/enterpriseSolutionRoutes";
import uploadRoute from "./routes/uploadRoutes";
import MentorRoute from "./routes/mentorRoutes";
import ExamRoute from "./routes/examRoutes";
import ProgramRoute from "./routes/programRoutes";
import ResearchRoute from "./routes/researchRoutes";
import aboutRoute from "./routes/aboutRoutes";
import toolRoute from "./routes/toolRoutes";
import ProductRoute from "./routes/productRoutes";
import modalRoute from "./routes/consentRoutes";
import chatRoutes from "./routes/chatRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import orderRoutes from "./routes/orderRoutes";
import mentorApplicationRoutes from "./routes/mentorApplicationRoutes";

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(compression({ filter: shouldCompress, level: 6 }));
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:5175",
  "https://next-doc-uk.vercel.app",
  "https://next-doc-uk-admin.vercel.app",
  "https://next-doc-mentor.vercel.app",
  "https://next-doc-uk-frontends.onrender.com",
  "https://next-doc-uk-frontendsdkf.onrender.com",
   "https://admin-frontends-spe2.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.set("trust proxy", true);
app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(uploadRoute);
app.use("/chat", chatRoutes);
app.use("/super-admin", superAdminRoutes);
app.use("/user", userRoutes);
app.use("/mentor", MentorRoute);
app.use("/mentor-application", mentorApplicationRoutes);
app.use("/exam", ExamRoute);
app.use("/program", ProgramRoute);
app.use("/about", aboutRoute);
app.use("/research", ResearchRoute);
app.use("/tools", toolRoute);
app.use("/trust", trustRoutes);
app.use("/product", ProductRoute);
app.use("/modal", modalRoute);
app.use("/plab", plabRoutes);
app.use("/payment", paymentRoutes);
app.use("/order", orderRoutes);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await databaseConnection();
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server Listening @ ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
