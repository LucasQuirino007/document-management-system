class DocumentsRepository {
  constructor() {
    this.documents = [];
  }

  save(documentMetadata) {
    this.documents.push(documentMetadata);
    return documentMetadata;
  }

  list() {
    return [...this.documents];
  }

  findById(id) {
    return this.documents.find((document) => document.id === id) || null;
  }
}

module.exports = DocumentsRepository;