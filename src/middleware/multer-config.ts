import multer from "multer";

interface MimeTypes {
  [key: string]: string;
}

const mimeTypes: MimeTypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + mimeTypes[file.mimetype]);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (mimeTypes[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
});
