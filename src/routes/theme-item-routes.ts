import { Router } from "express";
import { upload } from "middleware/multer-config";
import { addThemeItem, updateThemeItem, deleteThemeItem } from "controllers/theme-item-controller";

const router = Router();

// Theme Items Endpoint
router.post("/api/theme-items", upload.single("image"), addThemeItem);
router.put("/api/theme-items/:id", upload.single("image"), updateThemeItem);
router.delete("/api/theme-items/:id", deleteThemeItem);

export default router;