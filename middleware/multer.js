const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, fille, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const randomNumber = Math.floor(Math.random()*100);
        const ext = file.mimetype.split('/')[1];
        const uniqueExt = `IMG_${Date.now()}${randomNumber}.${ext}`;
        cb(null, uniqueExt)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    }else{
        cb(new Error('Invalid file format, Only image files allowed'))
    }
};

const limits = {
    fileSize: 1024 * 1024 * 1
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;
