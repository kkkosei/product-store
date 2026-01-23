import Express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = Express();

app.use(cors({origin:ENV.FRONTEND_URL})); // enable CORS
app.use(clerkMiddleware()); // auth obj will be attached to req
app.use(Express.json()); // parses json requests bodies
app.use(Express.urlencoded({ extended: true })); // parses from data (like HTML forms)

app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to Productify API - Powered by PostgresSQL, Dizzle ORM & Clerk Auth" ,
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments"},
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});