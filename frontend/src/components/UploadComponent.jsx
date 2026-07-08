import { useState } from 'react';

export default function UploadComponent({ onUpload, disabled }) {
  const [owner, setOwner] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      return;
    }

    const wasUploaded = await onUpload({ owner, file: selectedFile });

    if (wasUploaded) {
      setSelectedFile(null);
      event.target.reset();
    }
  };

  return (
    <section>
      <h2>Upload de documento</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="owner">Dono (opcional)</label>
          <br />
          <input
            id="owner"
            name="owner"
            type="text"
            value={owner}
            disabled={disabled}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Ex.: Lucas"
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="document">Arquivo</label>
          <br />
          <input
            id="document"
            name="document"
            type="file"
            disabled={disabled}
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            required
          />
        </div>

        <button type="submit" disabled={disabled || !selectedFile}>
          {disabled ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
    </section>
  );
}