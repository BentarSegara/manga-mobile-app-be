import express from "express";
import userRoutes from "./routes/users.js";
import mangaRoutes from "./routes/mangas.js";

const app = express();

app.use(express.json());
app.use("/user", userRoutes);
app.use("/manga", mangaRoutes);

app.listen(3000, () => {
  console.info("Server listening on port 3000");
});
