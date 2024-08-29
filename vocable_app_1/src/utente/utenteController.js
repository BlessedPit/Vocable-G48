const { response } = require("express");
var utenteService = require("./utenteServices");
//const authenticateToken = require('./authenticateToken');

var createUtenteControllerFn = async (req, res) => {
    try {
        console.log("\nregistration");
        console.log(req.body);
        var status = await utenteService.createUtenteDBService(req.body);
        console.log("Status dal servizio:", status);

        if (status && status.status === true) {
            res.send({ "status": true, "message": "Utente creato con successo" });
        } else {
            res.send({ "status": false, "message": status.msg || "Errore: Impossibile creare l'utente" });
        }
    } catch(err) {
        console.log(err);
        res.send({"status":false,"message":err.msg});
    }
}


var loginUtenteControllerFn = async (req, res) => {
    var result = null;
    console.log("\nlogin");
    console.log(req.body);
    try {
        result = await utenteService.loginUtenteDBService(req.body);
        if(result.status){
            console.log("true");
            res.send({ "status":true, "message":result.msg, "token":result.token, "id":result.id });
        } else {
            console.log("false");
            res.send({ "status":false, "message":result.msg });
        }
    } catch(errore) {
        console.log(errore);
        res.send({"status":false,"message":errore.msg});
    }
}

/*
var forgotPasswordControllerFn = async (req, res) => {
    try {
        console.log("Richiesta di reset password ricevuta:", req.body); // Log dei dati ricevuti nella richiesta

        const status = await utenteService.generateResetToken(req.body.email);
        console.log("Risultato dalla funzione generateResetToken:", status); // Log del risultato della generazione del token

        if (status && status.status === true) {
            console.log("Token di reset generato con successo:", status.resetToken); // Log del token generato
            res.status(200).send({
                "status": true,
                "message": "Token di reset generato con successo. Controlla la tua email per il link di reset.",
                "resetToken": status.resetToken
            });
        } else {
            console.error("Errore durante la generazione del token di reset:", status.msg); // Log dell'errore se il token non è stato generato
            res.status(400).send({
                "status": false,
                "message": status.msg || "Errore: Impossibile generare il token di reset"
            });
        }
    } catch (err) {
        console.error("Errore nel forgotPasswordControllerFn:", err); // Log dell'errore catturato
        res.status(500).send({
            "status": false,
            "message": err.message || "Errore durante la generazione del token di reset"
        });
    }
};
*/

var meUtenteControllerFn = async (req, res) => {
    try {
        // Trova l'utente nel database utilizzando l'email memorizzata nel token
        const user = await utenteService.findUserByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({ msg: 'Utente non trovato' });
        }

        // Restituiscie i dettagli dell'utente
        res.json({
            email: user.email,
            nickname: user.nickname,
            id: user._id
        });
    } catch (error) {
        res.status(500).json({ msg: 'Errore del server' });
    }
}

var logoutUtenteControllerFn = async (req, res) => {
        // Restituisce messaggi di successo o di fallimento
    try {
        res.status(200).send({
            status: true,
            message: "Logout avvenuto con successo"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            message: "Errore durante il logout"
        });
    }
}

const jwt = require('jsonwebtoken');
const utenteServices = require('./utenteServices');

// Funzione per gestire la richiesta di reset della password
async function forgotPasswordControllerFn(req, res) {
    const { email } = req.body;

    // Verifica se l'email esiste nel database
    // TODO: Aggiungi la logica di verifica dell'email

    // Genera un token di reset
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    try {
        // Invia l'email con il link di reset
        await utenteServices.sendPasswordResetEmail(email, resetToken);
        res.status(200).json({ status: true, message: 'Link di reset inviato con successo' });
    } catch (error) {
        console.error('Errore durante l\'invio del link di reset:', error);
        res.status(500).json({ status: false, message: 'Errore durante l\'invio del link di reset' });
    }
}



module.exports = { createUtenteControllerFn, loginUtenteControllerFn, meUtenteControllerFn, logoutUtenteControllerFn, forgotPasswordControllerFn  };
