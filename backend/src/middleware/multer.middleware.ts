import multer from 'multer';
import path from 'path';
const storage = multer.memoryStorage();
export const upload = multer({ storage ,
    limits:{
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
            const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
})