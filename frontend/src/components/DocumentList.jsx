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
      <h2 className="text-lg font-semibold text-ink sm:text-xl">Documentos</h2>

      {documents.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600">
          Nenhum documento enviado ainda.
        </p>
      ) : (
        <ul className="mt-4 grid list-none gap-3 p-0 sm:gap-4">
          {documents.map((document) => (
            <li
              key={document.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-soft sm:p-5"
            >
              <strong className="break-words text-base font-semibold text-slate-900 sm:text-lg">
                {document.originalName}
              </strong>

              <div className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                <p>Dono: {document.owner}</p>
                <p>Tamanho: {formatBytes(document.size)}</p>
                <p className="sm:col-span-2">Enviado em: {formatDate(document.uploadedAt)}</p>
              </div>

              <div className="mt-4">
                <DownloadButton
                  documentId={document.id}
                  filename={document.originalName}
                  onError={onDownloadError}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}