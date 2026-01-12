import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentsRouter } from "./modules/comments/comments.router";
import errorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";
const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials:true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/posts", postRouter);
app.use('/comments',commentsRouter)
app.get("/", (req, res) => {
  res.send("Hello from prisma-blog backend");
});

app.use(notFound)
app.use(errorHandler)
export default app;
