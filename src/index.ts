import express from "express";
import cors from "cors";
import { upload } from "middleware/multer-config";

// Route imports
import themeRoutes from "routes/theme-routes";
import themeItemRoutes from "routes/theme-item-routes";

// Create an express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/image", express.static("public"));

// Routes
app.use(themeRoutes);
app.use(themeItemRoutes)

app.listen(80, () => {
  console.log("Server is running on port 80");
});
