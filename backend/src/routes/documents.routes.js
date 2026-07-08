const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const multer = require('multer');

const DocumentsController = require('../controllers/documents.controller');
const DocumentsService = require('../services/documents.service');
const DocumentsRepository = require('../repositories/documents.repository');

const router = express.Router();
const storageDirectory = path.resolve(__dirname, '../../storage');

fs.mkdirSync(storageDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, storageDirectory);
  },
  filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const documentsRepository = new DocumentsRepository();
const documentsService = new DocumentsService(documentsRepository);
const documentsController = new DocumentsController(documentsService);

router.post('/upload', upload.single('document'), documentsController.upload);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const uploadErrorMessage = error.code === 'LIMIT_FILE_SIZE'
      ? 'Arquivo excede o limite de 10MB'
      : 'Falha no upload do arquivo';

    return res.status(400).json({ message: uploadErrorMessage });
  }

  if (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }

  return next();
});

module.exports = router;