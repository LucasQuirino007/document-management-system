import { useCallback, useEffect, useState } from 'react';
import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { listDocuments, uploadDocument } from './services/documentsApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocuments(true);

    try {
      const data = await listDocuments();
      setDocuments(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async ({ owner, file }) => {
    setIsUploading(true);
    setSuccessMessage('');

    try {
      await uploadDocument({ owner, file });
      setErrorMessage('');
      setSuccessMessage('Documento enviado com sucesso.');
      await loadDocuments();
      return true;
    } catch (error) {
      setErrorMessage(error.message);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadError = (message) => {
    setErrorMessage(message);
  };

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Document Management System</h1>

      {errorMessage ? (
        <p style={{ color: '#b00020' }} role="alert">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p style={{ color: '#1f7a1f' }} role="status">
          {successMessage}
        </p>
      ) : null}

      <UploadComponent onUpload={handleUpload} disabled={isUploading} />

      <hr style={{ margin: '1.5rem 0' }} />

      {isLoadingDocuments ? (
        <p>Carregando documentos...</p>
      ) : (
        <DocumentList documents={documents} onDownloadError={handleDownloadError} />
      )}
    </main>
  );
}
