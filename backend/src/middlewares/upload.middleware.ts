import fs from "fs";
import path from "path";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const root = path.resolve(process.cwd(), "public/temp");
const imageDir = path.join(root, "images");
const pdfDir = path.join(root, "pdf");

[imageDir, pdfDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, file.mimetype === "application/pdf" ? pdfDir : imageDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      cb(new ApiError(400, "Only PDF, JPG and PNG files are allowed"));
      return;
    }
    cb(null, true);
  },
});
