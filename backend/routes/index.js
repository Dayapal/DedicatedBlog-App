import express from "express";
import userRouter from "./user.route.js";
import blogRouter from "./blog.route.js";
import contactRouter from "./contact.route.js";
import healthRouter from "./health.route.js";

const apiV1Router = express.Router();

apiV1Router.use("/health", healthRouter);
apiV1Router.use("/user", userRouter);
apiV1Router.use("/blogs", blogRouter);
apiV1Router.use("/contact", contactRouter);

export default apiV1Router;
