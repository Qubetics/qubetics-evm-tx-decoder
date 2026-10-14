# Qubetics EVM Transaction Decoder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Node](https://img.shields.io/badge/node-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

A backend worker for the Qubetics EVM indexer. It decodes smart-contract transaction **inputs** and **event logs** with the contract's verified ABI and saves the readable result for the explorer and its APIs.

---

## How It Works

```
 ┌──────────────┐   enqueue    ┌────────────────────┐   consume   ┌──────────────────────┐
 │  EVM Indexer │ ───────────▶ │      RabbitMQ      │ ──────────▶ │   EVM TX Decoder     │
 │ / Verifier   │              │  (2 queues below)  │             │   (this service)     │
 └──────────────┘              └────────────────────┘             └──────────┬───────────┘
                                                                             │ read Transactions,
                                                                             │ ContractLogs, ContractVerification
                                                                             ▼ write DecodedLogs
                                                                  ┌──────────────────────┐
                                                                  │     PostgreSQL       │
                                                                  └──────────────────────┘
```

| Queue | Payload | Behaviour |
|---|---|---|
| `TRANSACTION_LOGS_DECODING` | `{ "contractAddress": "0x..." }` | Back-fills all past `CONTRACT_CREATION` / `CONTRACT_TRANSFER` transactions for a newly verified contract, 100 at a time. |
| `DECODE_NEW_TRANSACTION` | `{ "txHash": "0x..." }` | Decodes one new transaction made to a verified contract. |

For each transaction, the service:
1. Loads the ABI (`abi`, with `abis` as a fallback) from `ContractVerification`.
2. Decodes the method input with [`abi-decoder`](https://github.com/ConsenSys/abi-decoder). Contract-creation transactions are skipped.
3. Decodes the event logs stored in `ContractLogs`.
4. Saves the result to `DecodedLogs` as `txHash`, `contractAddress`, `input` and `logs`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20, TypeScript 5 |
| HTTP | Express, Helmet, CORS |
| Messaging | RabbitMQ (`amqplib`) |
| Database | PostgreSQL via Prisma ORM (with read-replica extension) |
| Decoding | `abi-decoder`, `web3` |
| Logging | Winston, Morgan |
| Tooling | ESLint (Airbnb), Prettier, Husky, Jest |

---

## Project Structure

```
.
├── index.js                  # Entry point (loads src/server)
├── prisma/schema.prisma      # Shared indexer database schema
├── src/
│   ├── server.ts             # Bootstrap: env → DB → RabbitMQ → HTTP server
│   ├── App.ts                # Express app & middleware
│   ├── routes.ts             # HTTP routes (/status)
│   ├── queue-consumers/      # ContractTxLogsDecoder (decoding logic)
│   ├── service/              # db, rabbitmq, redis services
│   ├── environments/         # Environment loader (.env per NODE_ENV)
│   ├── constant/             # Queue names, messages, error codes
│   ├── helper/ lib/ ...      # Utilities, logger
├── Dockerfile
└── .github/workflows/        # CI/CD pipelines
```

---

## Prerequisites

- **Node.js** 20.x and **npm**
- **PostgreSQL** 13+ that uses the Qubetics indexer schema
- **RabbitMQ** 3.x
- An **EVM JSON-RPC endpoint** for the Qubetics chain
- *(Optional)* Docker

---

## Configuration

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | No (default `3146`) | HTTP port | `7400` |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/mydb?schema=contract` |
| `RABITMQ_URL` | Yes | RabbitMQ AMQP URL (the spelling is intentional) | `amqp://user:pass@localhost:5672` |
| `EVM_TENDERMENT_HTTP_HOST` | Yes | EVM JSON-RPC HTTP endpoint | `https://rpc.example.com` |
| `REDIS_HOST` / `REDIS_PORT` | No | Redis. The client exists but is currently turned off. | `localhost` / `6379` |
| `API_LOGS_ENABLE` | No | `1` turns on HTTP request logging | `0` |
| `ENV_INJECTED` | No | `1` uses runtime environment variables instead of a `.env` file | `1` |

`NODE_ENV` chooses the env file:

| `NODE_ENV` | File |
|---|---|
| `local` / `dev` (default) | `.env` |
| `test` | `.env.test` |
| `staging` | `.env.stag` |
| `production` | `.env.prod` (or `ENV_INJECTED=1`) |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Generate the Prisma client
npm run generate:prisma

# 3. Run in development mode (hot reload)
npm start            # or: npm run start:local (runs lint first)
```

### Production build

```bash
npm run build:prod                 # compiles to ./build
NODE_ENV=production ENV_INJECTED=1 node build/src/server.js
```

### Docker

```bash
docker build -t qubetics-evm-tx-decoder .
docker run -d --name evm-tx-decoder \
  -e DATABASE_URL=... -e RABITMQ_URL=... -e EVM_TENDERMENT_HTTP_HOST=... -e PORT=7900 \
  -p 7900:7900 qubetics-evm-tx-decoder
```

> **Note:** The database schema belongs to the main Qubetics indexer. Run migrations from that service. This decoder only reads and writes existing tables.

---

## Health Check

```bash
curl http://localhost:<PORT>/status
# {"message":"Service is up and running."}
```

All other routes return `501 Not Implemented`. The service does its work through the queues, not through HTTP.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm start` | Dev server with nodemon |
| `npm run build:prod` | Compile TypeScript |
| `npm run start:prod` | Start compiled build (production) |
| `npm run lint` / `lint-fix` | ESLint |
| `npm run pretty` | Prettier format |
| `npm run generate:prisma` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

---

## Contributing

1. Create a branch from `dev`: `git checkout -b feature/<name>`
2. Commit your changes. Husky runs lint and Prettier on commit and lint on push.
3. Open a Pull Request to `dev`.

Branches: `dev` → `testnet` → `master` (production).

---

## License

This project is licensed under the [MIT License](LICENSE).
