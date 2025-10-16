# Cómo ver la página web (UI)

## React (Vite)
1) Backend en `http://localhost:4000`
2) En otra terminal:
```bash
cd frontend-react
cp .env.example .env.local   # VITE_BACKEND_URL=http://localhost:4000
npm install
npm run dev
```
3) Abre el URL que imprime Vite (normalmente `http://localhost:5173`).

## Build y preview
```bash
cd frontend-react
npm run build
npm run preview
# Generalmente http://localhost:4173
```

## HTML/JS simple
```bash
cd frontend
python3 -m http.server 5173
# http://localhost:5173
```
