class DocumentsController {
  constructor(documentsService) {
    this.documentsService = documentsService;

    this.upload = this.upload.bind(this);
    this.list = this.list.bind(this);
    this.download = this.download.bind(this);
  }

  upload(req, res) {
    try {
      const document = this.documentsService.create({
        file: req.file,
        owner: req.body?.owner,
      });

      res.status(201).json(document);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message || 'Erro interno do servidor' });
    }
  }

  list(req, res) {
    try {
      const documents = this.documentsService.list();
      res.json(documents);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message || 'Erro interno do servidor' });
    }
  }

  download(req, res) {
    try {
      const { id } = req.params;
      const document = this.documentsService.getDownloadById(id);

      res.setHeader('Content-Type', document.mimeType);
      res.download(document.path, document.filename);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message || 'Erro interno do servidor' });
    }
  }
}

module.exports = DocumentsController;