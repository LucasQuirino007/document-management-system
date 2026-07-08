import DownloadButton from './DownloadButton';

function formatBytes(sizeInBytes) {
  if (!Number.isFinite(sizeInBytes)) {
    return '-';
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  const sizeInKb = sizeInBytes / 1024;

  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(1)} KB`;
  }

  return `${(sizeInKb / 1024).toFixed(1)} MB`;
}

function formatDate(isoDate) {
  if (!isoDate) {
    return '-';
  }

  return new Date(isoDate).toLocaleString('pt-BR');
}

export default function DocumentList({ documents, onDownloadError }) {
  return (
    <section>
      <h2>Documentos</h2>

      {documents.length === 0 ? (
        <p>Nenhum documento enviado ainda.</p>
      ) : (
        <ul style={{ display: 'grid', gap: '0.75rem', padding: 0, listStyle: 'none' }}>
          {documents.map((document) => (
            <li key={document.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem' }}>
              <strong>{document.originalName}</strong>
              <p style={{ margin: '0.5rem 0' }}>Dono: {document.owner}</p>
              <p style={{ margin: '0.5rem 0' }}>Tamanho: {formatBytes(document.size)}</p>
              <p style={{ margin: '0.5rem 0' }}>Enviado em: {formatDate(document.uploadedAt)}</p>

              <DownloadButton
                documentId={document.id}
                filename={document.originalName}
                onError={onDownloadError}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}