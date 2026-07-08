# Especificação - Document Management System (DMS)

## 1. Objetivo

Entregar um sistema web simples de gestão de documentos que permita upload, listagem e download com armazenamento local de arquivos e metadados em memória.

## 2. Escopo

### Dentro do escopo

- Upload de documentos via API.
- Listagem de documentos por usuário.
- Download de documento por identificador.
- Registro e consulta de metadados do documento.
- Armazenamento local em filesystem da aplicação usando multer com diskStorage.
- Organização do backend em Clean Architecture simples: routes, controllers, services e repositories.

### Fora do escopo

- Armazenamento externo (S3, GCS, Azure Blob ou similares).
- Versionamento de documentos.
- OCR, indexação textual ou busca avançada de conteúdo.
- Compartilhamento de documentos entre usuários.
- Exclusão lógica/física de documentos nesta fase.
- Autenticação completa com login e gestão de sessão.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir que um usuário envie um documento por meio do endpoint POST /upload. |
| RF-02 | O sistema deve gerar um id único (UUID v4) para cada documento enviado. |
| RF-03 | O sistema deve persistir o arquivo enviado no filesystem local em backend/storage. |
| RF-04 | O sistema deve persistir em memória os metadados do documento enviado. |
| RF-05 | O sistema deve identificar o dono do documento pelo header X-User-Id. |
| RF-06 | O sistema deve listar apenas documentos do usuário informado no header X-User-Id em GET /documents. |
| RF-07 | O sistema deve permitir baixar um documento por id no endpoint GET /documents/:id/download. |
| RF-08 | O sistema deve impedir download quando o documento existir, mas pertencer a outro usuário. |
| RF-09 | O sistema deve retornar respostas JSON para operações de upload e listagem. |
| RF-10 | O sistema deve retornar o binário do arquivo com Content-Disposition de attachment no download. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | O backend deve ser implementado com Node.js e Express em CommonJS. |
| RNF-02 | O frontend deve ser implementado com React e Vite em ESM. |
| RNF-03 | O armazenamento de arquivos deve ser estritamente local no diretório backend/storage. |
| RNF-04 | O upload deve utilizar multer com diskStorage. |
| RNF-05 | Os metadados devem ser mantidos em memória nesta fase inicial. |
| RNF-06 | A configuração da aplicação deve seguir 12-Factor App por variáveis de ambiente. |
| RNF-07 | O backend deve manter separação de responsabilidades em routes -> controllers -> services -> repositories. |
| RNF-08 | O seed inicial deve permanecer simples e evolutivo, evitando overengineering. |

## 5. Modelo de dados (metadados do documento)

### Entidade: Document

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| id | string | Sim | Identificador único do documento no formato UUID v4. |
| originalName | string | Sim | Nome original do arquivo enviado pelo usuário. |
| size | number | Sim | Tamanho do arquivo em bytes. |
| uploadedAt | string | Sim | Data e hora do upload em formato ISO 8601. |
| owner | string | Sim | Identificador do usuário recebido por X-User-Id. |
| storagePath | string | Sim | Caminho local do arquivo salvo no filesystem. |
| mimeType | string | Sim | Tipo MIME informado pelo processo de upload. |

### Regras do modelo

- id é imutável após criação.
- owner é obrigatório para upload, listagem e download.
- storagePath é campo interno de persistência, não precisa ser exposto ao cliente.
- Não há banco de dados nesta fase, apenas estrutura em memória para metadados.

## 6. Contratos de API

### Convenções gerais

- Prefixo esperado no frontend: /api (via proxy do Vite).
- Identificação de usuário via header X-User-Id.
- Respostas de sucesso em JSON para upload/listagem.
- Respostas de erro em JSON no formato:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Mensagem descritiva"
  }
}
```

### POST /upload

Objetivo: enviar um documento e registrar seus metadados.

Entrada:
- Headers:
  - X-User-Id: string (obrigatório)
- Body:
  - multipart/form-data com campo file (obrigatório)

Resposta de sucesso:
- Status: 201
- Body:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "contrato.pdf",
  "size": 24576,
  "uploadedAt": "2026-07-08T12:00:00.000Z",
  "owner": "user-123",
  "mimeType": "application/pdf"
}
```

Erros previstos:
- 400 quando arquivo não for enviado.
- 400 quando X-User-Id não for informado.
- 500 em falha de gravação ou persistência de metadados.

### GET /documents

Objetivo: listar metadados dos documentos do usuário.

Entrada:
- Headers:
  - X-User-Id: string (obrigatório)

Resposta de sucesso:
- Status: 200
- Body:

```json
{
  "documents": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "originalName": "contrato.pdf",
      "size": 24576,
      "uploadedAt": "2026-07-08T12:00:00.000Z",
      "owner": "user-123",
      "mimeType": "application/pdf"
    }
  ]
}
```

Erros previstos:
- 400 quando X-User-Id não for informado.
- 500 em falha de consulta de metadados.

### GET /documents/:id/download

Objetivo: baixar o arquivo de um documento específico.

Entrada:
- Path params:
  - id: string (UUID v4 do documento)
- Headers:
  - X-User-Id: string (obrigatório)

Resposta de sucesso:
- Status: 200
- Headers:
  - Content-Type: tipo MIME do arquivo.
  - Content-Disposition: attachment; filename="<originalName>"
- Body: binário do arquivo.

Erros previstos:
- 400 quando id inválido ou X-User-Id não for informado.
- 403 quando documento pertencer a outro usuário.
- 404 quando documento não existir ou arquivo não for encontrado no storage.
- 500 em falha inesperada de leitura.

## 7. Decisões arquiteturais

### Backend (Clean Architecture simples)

- routes:
  - Define endpoints HTTP e conecta controllers.
  - Não contém regra de negócio.
- controllers:
  - Faz parsing de request, validação básica de entrada e mapeamento de resposta HTTP.
- services:
  - Implementa regra de negócio de upload, listagem e download.
  - Aplica regras de ownership e consistência de metadados.
- repositories:
  - Encapsula persistência local:
    - gravação e leitura de arquivo no filesystem.
    - armazenamento de metadados em memória.

Dependência obrigatória:
- routes -> controllers -> services -> repositories.

### Frontend

- Organização por componentes, páginas e serviços.
- Camada services centraliza chamadas fetch para /api.
- Componentes consomem a camada de serviços sem acoplar detalhes de transporte.

### Armazenamento

- Arquivos:
  - Salvos localmente em backend/storage.
  - Processamento de upload via multer diskStorage.
- Metadados:
  - Mantidos em memória na aplicação.
  - Voláteis entre reinicializações.

## 8. Plano de execução em etapas

Observação: este plano descreve somente etapas de implementação futura. Não inclui execução de arquivos de backend e frontend neste documento.

1. Estruturar o backend por camadas (routes, controllers, services, repositories) e definir contratos internos.
2. Implementar upload com multer diskStorage, geração de UUID v4 e persistência de metadados em memória.
3. Implementar listagem por owner com validação de X-User-Id.
4. Implementar download por id com validação de ownership e envio binário com headers corretos.
5. Criar tratamento padronizado de erros HTTP para todos os endpoints.
6. Cobrir backend com testes unitários e de integração para fluxos de sucesso e falha.
7. Implementar camada de serviços de API no frontend para upload, listagem e download.
8. Implementar páginas e componentes de frontend conectados à API via /api.
9. Validar fluxo ponta a ponta e refinar mensagens de erro e usabilidade.
10. Preparar evolução da persistência de metadados (futuro) sem quebrar contrato público atual.
