import { Router } from "express";
import { upload } from "middleware/multer-config";
import { addTheme, deleteTheme, getAllThemes, getThemeById, updateTheme, updateThemeImage } from "controllers/theme-controller";

const router = Router();

// Themes Endpoint
router.get("/api/themes", getAllThemes)
router.get("/api/themes/:id", getThemeById)
router.post("/api/themes", upload.single("image"), addTheme)
router.put("/api/themes/:id", updateTheme)
router.put("/api/themes/:id/image", upload.single("image"), updateThemeImage)
router.delete("/api/themes/:id", deleteTheme)

export default router;
