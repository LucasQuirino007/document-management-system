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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-start px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="w-full rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur-sm sm:p-8">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Painel</p>
          <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">Document Management System</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Gerencie uploads, acompanhe metadados e baixe documentos de forma centralizada.
          </p>
        </header>

        {errorMessage ? (
          <p
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            role="status"
          >
            {successMessage}
          </p>
        ) : null}

        <UploadComponent onUpload={handleUpload} disabled={isUploading} />

        <div className="my-7 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" aria-hidden="true" />

        {isLoadingDocuments ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            Carregando documentos...
          </p>
        ) : (
          <DocumentList documents={documents} onDownloadError={handleDownloadError} />
        )}
      </div>
    </main>
  );
}
