const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./route/routes');
require('dotenv').config(); // Carica le variabili d'ambiente dal file .env

const app = express(); 

// Configurazioni Mongoose
mongoose.set('strictQuery', false); // Per evitare warning


const axios = require('axios');

axios.get('https://ifconfig.me')
  .then(response => {
    console.log('IP Pubblico di Railway:', response.data);
  })
  .catch(error => {
    console.error('Errore nel recupero dell\'IP:', error);
  });

  
// Estrai le variabili d'ambiente
const uri = process.env.MONGO_URI; // MongoDB URI
const PORT = process.env.PORT || 9992; // Porta del server
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'; // URL del client

// Configurazione CORS per permettere richieste dal frontend
app.use(cors({
    origin: clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve i file statici dal frontend build
app.use(express.static(path.join(__dirname, 'FrontEnd', 'dist')));

// Catch-all route per servire index.html per tutte le richieste non gestite
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'FrontEnd', 'dist', 'index.html'));
});

// Inizializza il server
app.listen(PORT, (err) => {
    if (err) {
        console.log("Errore connessione al server:", err);
    } else {
        console.log(`Server in ascolto sulla porta ${PORT}`);
    }
});

// Funzione per connettersi a MongoDB con Mongoose
async function run() {
    try {
        await mongoose.connect(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true
            }
        });
        console.log("Connesso a MongoDB!");
    } catch (error) {
        console.error("Errore di connessione a MongoDB:", error);
    }
}
run().catch(console.dir);

// Middleware per la gestione delle rotte
app.use(express.json());
app.use(routes);
