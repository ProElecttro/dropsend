const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 5050;
const UPLOAD_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },

    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);

        const filename =
            `${timestamp}-${random}${extension}`;

        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 100 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});


/*
 * Redirect root to /app
 */
app.get("/", (req, res) => {
    res.redirect("/dropsend");
});


/*
 * Serve frontend
 *
 * http://dropsend/app
 */
app.use(
    "/dropsend",
    express.static(
        path.join(__dirname, "public")
    )
);


/*
 * Upload photos
 *
 * POST /app/upload
 */
app.post(
    "/dropsend/upload",
    upload.array("photos", 100),
    (req, res) => {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No photos uploaded"
            });
        }

        console.log(
            `Received ${req.files.length} photo(s)`
        );

        res.json({
            success: true,
            count: req.files.length,

            files: req.files.map(
                file => file.filename
            )
        });
    }
);


/*
 * Health check
 *
 * GET /health
 */
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});


/*
 * Error handler
 */
app.use((err, req, res, next) => {

    console.error(err);

    res.status(400).json({
        success: false,
        message: err.message
    });
});


/*
 * Start server
 */
app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `DropSend running on port ${PORT}`
        );
    }
);
