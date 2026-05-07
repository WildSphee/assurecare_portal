# AssureCare Portal

Caregiver + Doctor dashboard prototype for heart patient monitoring.

This repo contains the frontend app (`assurecare-portal/`) plus root-level helper scripts for local development and VM deployment.

---

## 🏆 Award — NUS Synapxe IMDA AI Innovation Challenge

**Team ASSURE** brought home the trophy at the **NUS Synapxe IMDA AI Innovation Challenge**, competing against 181 teams and 800+ participants!

| | |
|---|---|
| ![Award photo 2](docs/award_2.jpeg) | ![Award photo 1](docs/award_1.jpeg) |
| ![Award photo 3](docs/award_3.jpeg) | |

**Team members:**

- [Reagan Chan](https://www.linkedin.com/in/reagan-chan/?skipRedirect=true)
- [Aishwarya Jayaraman](https://www.linkedin.com/in/aishwarya-jayaraman-7a47a422a/)
- [Sara Tan](https://www.linkedin.com/in/sara-tan-kwan-ling/)
- [Sandra Lim](https://www.linkedin.com/in/sandra-lim-4b7a1622/)
- [Udhaya Rathinavel](https://www.linkedin.com/in/udhaya-rathinavel-739689166/)
- [Hsinning Lu](https://www.linkedin.com/in/lu-hsin-ning/)

---

## Repo Structure

- `assurecare-portal/` - React + TypeScript + Vite frontend
- `start.sh` - starts the Vite dev server (defaults to port `5888`)
- `build_and_deploy.sh` - builds the frontend and deploys `dist/` to the live Nginx web root

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Recharts
- React Router

## Local Development

From repo root (recommended):

```bash
./start.sh
```

Defaults:

- Host: `0.0.0.0`
- Port: `5888`

Override if needed:

```bash
HOST=0.0.0.0 PORT=6000 ./start.sh
```

Manual app commands:

```bash
cd assurecare-portal
npm install
npm run dev
```

## Build (Local / CI)

```bash
cd assurecare-portal
npm run build
```

Build output is generated in:

- `assurecare-portal/dist/`

## Production Deploy (Nginx Static Hosting)

This VM serves the app as static files through Nginx (not `vite preview`).

Use the root deploy script:

```bash
./build_and_deploy.sh
```

What it does:

1. Installs dependencies if `node_modules` is missing
2. Runs `npm run build` inside `assurecare-portal/`
3. Syncs `dist/` to `/var/www/heartpatientcare.com`
4. Reloads Nginx

### Deploy Script Environment Overrides

```bash
APP_DIR=/home/azureuser/assurecare_portal/assurecare-portal \
TARGET_DIR=/var/www/heartpatientcare.com \
RELOAD_NGINX=1 \
./build_and_deploy.sh
```

- `APP_DIR` - frontend app directory
- `TARGET_DIR` - Nginx web root for the built site
- `RELOAD_NGINX` - set to `0` to skip reload

Example (build + sync only):

```bash
RELOAD_NGINX=0 ./build_and_deploy.sh
```

## Notes

- The deploy script name is `build_and_deploy.sh` (renamed from the earlier `deploy.sh`).
- The frontend app also has its own template README at `assurecare-portal/README.md`, but this root README is the operational entry point for this repo.

