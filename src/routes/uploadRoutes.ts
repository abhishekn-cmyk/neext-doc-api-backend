import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.memoryStorage();
const upload = multer({ storage });

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
      }

      const folderPath = (req.query.folder as string) || "uploads";
      const uploadDir = path.join(__dirname, `../${folderPath}`);

      if (!fs.existsSync(uploadDir)) {
        await fs.promises.mkdir(uploadDir, { recursive: true });
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      const baseName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `${baseName}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, req.file.buffer);

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        filePath: `${folderPath}/${fileName}`,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
