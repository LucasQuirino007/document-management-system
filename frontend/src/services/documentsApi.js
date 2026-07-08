const API_PREFIX = '/api';

async function parseResponse(response) {
  if (response.ok) {
    return response;
  }

  let errorMessage = 'Falha na comunicacao com o servidor';

  try {
    const errorBody = await response.json();
    if (errorBody?.message) {
      errorMessage = errorBody.message;
    }
  } catch {
    // Mantem mensagem padrao quando o retorno nao for JSON.
  }

  const error = new Error(errorMessage);
  error.statusCode = response.status;
  throw error;
}

export async function listDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`);
  await parseResponse(response);
  return response.json();
}

export async function uploadDocument({ owner, file }) {
  const formData = new FormData();
  formData.append('document', file);

  if (owner && owner.trim()) {
    formData.append('owner', owner.trim());
  }

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });

  await parseResponse(response);
  return response.json();
}

export async function downloadDocument({ id, filename }) {
  const response = await fetch(`${API_PREFIX}/documents/${id}/download`);
  await parseResponse(response);

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = blobUrl;
  link.download = filename || 'documento';
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(blobUrl);
}