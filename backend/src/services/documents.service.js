const { randomUUID } = require('node:crypto');

class DocumentsService {
  constructor(documentsRepository) {
    this.documentsRepository = documentsRepository;
  }

  create({ file, owner }) {
    if (!file) {
      const error = new Error('Arquivo nao enviado');
      error.statusCode = 400;
      throw error;
    }

    const safeOwner = owner && owner.trim() ? owner.trim() : 'anonymous';

    const metadata = {
      id: randomUUID(),
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      filename: file.filename,
      path: file.path,
      owner: safeOwner,
      uploadedAt: new Date().toISOString(),
    };

    return this.documentsRepository.save(metadata);
  }

  list() {
    const documents = this.documentsRepository.list();
    return documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }

  getDownloadById(id) {
    const document = this.documentsRepository.findById(id);

    if (!document) {
      const error = new Error('Documento nao encontrado');
      error.statusCode = 404;
      throw error;
    }

    return {
      path: document.path,
      filename: document.originalName,
      mimeType: document.mimeType,
    };
  }
}

module.exports = DocumentsService;