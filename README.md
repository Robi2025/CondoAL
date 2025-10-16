# CondoAI

**Sistema integral de administración de condominios** (Chile). Automatiza cartolas bancarias, asigna pagos por unidad, genera cartas de cobranza en **PDF/DOCX** (individuales y masivas) y aplica validaciones básicas de quórum/roles según la **Ley 21.442**.

**Stack:** Backend Node.js + TypeScript (Express), Frontend React (Vite) y PostgreSQL (opcional, con Docker).

---

# CondoAI — Asistente para Administración de Condominios (MVP)

CondoAI automatiza tareas operativas y documentales: subir cartola, asignar pagos, generar cartas (PDF/DOCX/ZIP), guardar en Postgres y validar quórums simples.

## Demo local rápida

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# http://localhost:4000
```

### Frontend React (Vite)
```bash
cd frontend-react
cp .env.example .env.local   # VITE_BACKEND_URL=http://localhost:4000
npm install
npm run dev
```

### Frontend simple (HTML/JS)
```bash
cd frontend
python3 -m http.server 5173
# http://localhost:5173
```

## API principales
- POST `/api/payments/import`, `/api/payments/save`, GET `/api/payments`
- POST `/api/letters/notice.pdf`, `/api/letters/notice.docx`, `/api/letters/batch.zip`

## DB (Postgres)
- `infra/docker-compose.yml` para Postgres
- `infra/seed.sql` para unidades de ejemplo

## Ley 21.442 (scaffold) y roles
- `backend/src/domain/rules.ts` con `validaQuorum()` y permisos por rol

## Licencia
MIT
