# La Ricetta Perfetta 🍝

Progetto Finale - Gruppo AMA

## 📖 Descrizione

**La Ricetta Perfetta** è una web application che permette di condividere, scoprire e recensire ricette di cucina. Ogni utente può registrarsi, pubblicare le proprie ricette con ingredienti e descrizione, consultare quelle pubblicate dagli altri, e lasciare un voto e un commento su quelle che ha provato.

L'idea alla base è semplice: creare uno spazio condiviso dove chi ama cucinare può trovare ispirazione, salvare le proprie ricette in un unico posto e ricevere un feedback diretto dalla community su ciò che ha preparato. Un po' come un piccolo social network dedicato interamente al cibo.

## 🎯 Obiettivi del progetto

Questo progetto è stato realizzato come lavoro finale di gruppo, con i seguenti obiettivi:

- Progettare e sviluppare un'applicazione web completa, dal database all'interfaccia utente, lavorando in team;
- Applicare in un caso concreto un'architettura client-server, separando in modo chiaro frontend, backend e database;
- Gestire l'autenticazione degli utenti in modo sicuro;
- Costruire un'esperienza utente semplice e intuitiva, pensata per chi usa l'applicazione ogni giorno per cucinare;
- Lavorare in modo organizzato su un repository condiviso, dividendo le attività e i ruoli tra i membri del gruppo;
- Confrontarsi con problemi reali di sviluppo software, dalla progettazione del database alla gestione degli errori, fino al lavoro di squadra su Git.

## ✨ Funzionalità principali

- 🔐 **Registrazione e login** degli utenti, con autenticazione tramite token
- 📝 **Pubblicazione di ricette**, con titolo, descrizione, categoria, emoji ed elenco ingredienti
- 🔍 **Consultazione e ricerca** delle ricette, filtrabili per categoria o autore
- ⭐ **Recensioni**: ogni utente può votare (da 1 a 5) e commentare le ricette altrui, ma non la propria
- 👤 **Area personale**, dove ogni utente ritrova le proprie ricette pubblicate e le recensioni scritte
- ✏️ **Modifica ed eliminazione** delle proprie ricette in qualsiasi momento

## 🛠️ Stack tecnologico (in breve)

Il progetto è diviso in due parti che comunicano tra loro: un **frontend** realizzato in Angular, che gestisce l'interfaccia con cui l'utente interagisce, e un **backend** in Node.js, che si occupa della logica dell'applicazione e del salvataggio dei dati su **MongoDB Atlas**, un database cloud.

| Parte | Tecnologia |
|---|---|
| Frontend | Angular |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas (cloud) |
| Autenticazione | JWT (JSON Web Token) |

## ▶️ Come avviare il progetto in locale

```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
ng serve
```

Il database è ospitato su **MongoDB Atlas** (cloud), quindi non è necessario installare nulla in locale: basta una connection string valida, da inserire in un file `.env` nella cartella `Backend` (es. `MONGODB_URI=...`).

## 🔑 Account di prova

Per provare subito l'applicazione senza registrarsi, sono disponibili questi account di test:

| Email | Password |
|---|---|
| mario@test.com | password123 |
| sofia@test.com | password123 |
| luca@test.com | password123 |


## 📁 Struttura del progetto

```
Progetto-Finale-Gruppo-AMA/
├── Backend/              # API e logica applicativa (Node.js)
│   └── src/
│       ├── routes/       # definizione degli endpoint
│       ├── controllers/  # gestione delle richieste
│       ├── models/       # accesso al database (MongoDB)
│       ├── middleware/   # autenticazione
│       └── seed.ts       # popolamento dati di prova
│
└── Frontend/              # Interfaccia utente (Angular)
    └── src/app/
        ├── guards/           # protezione delle rotte (authGuard)
        └── pages/            # pagine dell'applicazione
            ├── home/
            ├── recipes/
            ├── recipe-detail/
            ├── add-recipe/
            ├── login/
            ├── register/
            └── profile/
```

## 👨‍👩‍👦 Il team

Progetto realizzato dal **Gruppo AMA** 🧑‍🍳, tre persone, tre ruoli complementari:

- 🎨 **Maria** — frontend e design dell'interfaccia
- 🎨 **Alessandro** — frontend e design dell'interfaccia
- ⚙️ **Angelo** — backend (API, database, autenticazione), con un contributo anche sul frontend

Un progetto nato dalla collaborazione e dalla voglia di mettere in pratica, tutti insieme, quanto imparato durante il percorso. 