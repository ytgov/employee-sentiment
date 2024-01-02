import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { API_PORT, FRONTEND_URL, APPLICATION_NAME, AUTH0_DOMAIN } from "./config";
import { participantRouter, answerRouter, userRouter, questionRouter } from "./routes";
import { doHealthCheck } from "./utils/health_check";

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'", `${AUTH0_DOMAIN}`],
      "base-uri": ["'self'"],
      "block-all-mixed-content": [],
      "font-src": ["'self'", "https:", "data:"],
      "frame-ancestors": ["'self'"],
      "img-src": ["'self'", "data:", "https:"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "'unsafe-eval'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "worker-src": ["'self'", "blob:"],
      "connect-src": ["'self'", `${AUTH0_DOMAIN}`],
    },
  })
);

// very basic CORS setup
app.use(
  cors({
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.get("/_status", (req: Request, res: Response) => {
  doHealthCheck(res);
});

app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);
app.use("/api/participant", participantRouter);
app.use("/api/answer", answerRouter);

// serves the static files generated by the front-end
app.use(express.static(path.join(__dirname, "web")));

// if no other routes match, just send the front-end
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "web") + "/index.html");
});

const PORT: number = parseInt(API_PORT as string);

app.listen(PORT, async () => {
  console.log(`${APPLICATION_NAME} API listenting on port ${PORT}`);
});
