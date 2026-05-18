# 🎮 Retro Arcade Portal

Un portale di giochi retro responsivo e moderno sviluppato interamente in **React nativo** (senza file HTML esterni o dipendenze pesanti). Il progetto include due grandi classici riadattati per essere giocati fluidamente sia da computer (tramite tastiera) sia da dispositivi mobili (tramite una pulsantiera touch dedicata).

🚀 **Link al gioco online:** [https://massimilianopetra.github.io/retro-arcade/](https://massimilianopetra.github.io/retro-arcade/)

---

## 🕹️ Giochi Inclusi

### 1. 🔴 Mastermind Classico (Edizione Originale)
Una fedele riproduzione logica del celebre gioco da tavolo degli anni '70 inventato da Mordecai Meirowitz.
- **Regole Originali:** Il codice segreto generato dall'algoritmo può contenere **colori ripetuti**.
- **Segnalini Chiave:** Pallini neri per indicare la posizione e il colore corretti; pallini bianchi per indicare il colore corretto ma in posizione errata.
- **Difficoltà:** Bilanciata con un massimo di **10 tentativi** a disposizione per decifrare il codice.

### 2. 🧱 Tetris Arcade
Il leggendario rompicapo geometrico sovietico, ottimizzato con una griglia fluida e adattiva.
- **Layout Responsivo:** Il canvas si ridimensiona automaticamente in tempo reale sfruttando al massimo l'altezza dello schermo del dispositivo.
- **Controlli da PC:** Freccia Sinistra/Destra (`A`/`D`) per muoversi, Freccia Su (`W`) per ruotare, Freccia Giù (`S`) per accelerare la caduta e **Barra Spaziatrice** per l'Hard Drop (caduta istantanea).
- **Controlli Mobile:** Pulsantiera touch posizionata sotto il tabellone per giocare comodamente da smartphone.
- **Anti-Scroll:** Blocco automatico dei tasti direzionali (`preventDefault`) per evitare il tremolio della pagina web durante le sessioni di gioco più frenetiche.

---

## 🛠️ Tecnologie Utilizzate

- **Framework Principale:** React 18 / 19 (Componenti funzionali e Hooks come `useState`, `useEffect`, `useRef`).
- **Build Tool:** Vite (per una compilazione ultra-rapida e server locale istantaneo).
- **Grafica e Stili:** CSS-in-JS (Stili inline nativi per mantenere l'applicazione autonoma, portabile e contenuta in un unico file principale).
- **Rendering di Gioco:** HTML5 Canvas API (utilizzato per la gestione della logica dei fotogrammi e della matrice dei blocchi di Tetris).
- **Hosting:** GitHub Pages con distribuzione automatizzata tramite il pacchetto `gh-pages`.

---

## 💻 Sviluppo Locale ed Esecuzione

Se desideri scaricare il progetto sul tuo computer e modificarlo, segui questi passaggi all'interno del tuo terminale:

1. **Clona il repository:**
   ```bash
   git clone https://github.com
   ```
2. **Entra nella cartella del progetto:**
   ```bash
   cd retro-arcade
   ```
3. **Installa le dipendenze di sistema:**
   ```bash
   npm install
   ```
4. **Avvia il server di sviluppo locale:**
   ```bash
   npm run dev
   ```
   Apri l'indirizzo `http://localhost:5173` sul tuo browser per testare i giochi.

---

## 🚀 Come Pubblicare o Aggiornare il Sito

Grazie alla configurazione automatizzata all'interno di `vite.config.js` (che riconosce dinamicamente l'ambiente di sviluppo o di produzione), l'aggiornamento richiede pochissimi passaggi:

1. **Salva i file sorgente su GitHub:**
   ```powershell
   git add .
   git commit -m "Descrizione della tua modifica"
   git push
   ```
2. **Invia l'aggiornamento grafico sul sito web pubblico:**
   ```powershell
   npm run deploy
   ```
   Questo comando compila l'applicazione nella cartella `dist/` e la distribuisce sul ramo `gh-pages` in circa 60 secondi.

---

## 📄 Licenza

Questo progetto è distribuito ad uso didattico e ricreativo. Sentiti libero di clonarlo, modificarlo o aggiungere nuovi giochi!
