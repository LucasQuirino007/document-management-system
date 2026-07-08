import { useState } from 'react';
import { downloadDocument } from '../services/documentsApi';

export default function DownloadButton({ documentId, filename, onError }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      await downloadDocument({ id: documentId, filename });
    } catch (error) {
      onError(error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button type="button" onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? 'Baixando...' : 'Download'}
    </button>
  );
}