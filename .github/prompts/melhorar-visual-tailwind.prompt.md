---
description: Melhora o visual do frontend com Tailwind CSS 3 mantendo as funcionalidades atuais.
name: melhorar-visual-tailwind
argument-hint: nivel visual (base ou premium)
agent: frontend-tailwind
---

# Melhorar visual com Tailwind CSS 3

Evolua o frontend para Tailwind CSS 3 usando o nivel `${input:nivel:premium}`.

Contexto funcional a preservar:

- Upload de documentos.
- Listagem de documentos.
- Download de documentos.
- Comunicacao com backend via prefixo `/api`.

Diretrizes:

1. Configure Tailwind CSS 3 no frontend com PostCSS.
2. Migre estilos inline para classes utilitarias Tailwind em:
   - `frontend/src/App.jsx`
   - `frontend/src/components/UploadComponent.jsx`
   - `frontend/src/components/DocumentList.jsx`
   - `frontend/src/components/DownloadButton.jsx`
3. Aplique uma direcao visual intencional e moderna, evitando layout generico.
4. Garanta responsividade em desktop e mobile.
5. Preserve comportamento existente e nao altere contratos de API.

Checklist de validacao:

1. `npm install` no frontend concluido.
2. `npm run build` no frontend sem erros.
3. Fluxos de upload, listagem e download funcionando.

Entregue tambem um resumo final com:

1. Arquivos alterados.
2. Decisoes visuais aplicadas.
3. Resultado da validacao.
