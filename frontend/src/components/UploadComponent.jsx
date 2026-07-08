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
    <section className="rounded-2xl border border-slate-200 bg-mist p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-ink sm:text-xl">Upload de documento</h2>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="owner" className="text-sm font-medium text-slate-700">
            Dono (opcional)
          </label>
          <input
            id="owner"
            name="owner"
            type="text"
            value={owner}
            disabled={disabled}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Ex.: Lucas"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="document" className="text-sm font-medium text-slate-700">
            Arquivo
          </label>
          <input
            id="document"
            name="document"
            type="file"
            disabled={disabled}
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            required
            className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !selectedFile}
          className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
        >
          {disabled ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
    </section>
  );
}