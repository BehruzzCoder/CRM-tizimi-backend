import { diskStorage } from "multer";

export const multerConfig = {
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
};
