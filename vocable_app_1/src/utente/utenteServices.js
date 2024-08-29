const utenteModel = require('./utenteModel');
const utentestatsModel = require('./utentestatsModel');
const jwt = require('jsonwebtoken');
const encryptor = require('simple-encryptor')('hqBzkw4H7Iog6561'); // chiave per criptare le password
require('dotenv').config();
const emailjs = require('emailjs-com');

// Funzione per la creazione di un nuovo utente
module.exports.createUtenteDBService = (utenteDetails) => {
    return new Promise(function myFN(resolve, reject) {
        utenteModel.findOne({ email: utenteDetails.email }, function (error, existingUser) {
            if (error) {
                reject({ status: false, msg: "Errore durante la verifica dell'email" + error });
            } else if (existingUser) {
                reject({ status: false, msg: "Email già in uso" });
            } else {
                const utenteModelData = new utenteModel();
                utenteModelData.email = utenteDetails.email;
                utenteModelData.nickname = utenteDetails.nickname;

                const encryptedPassword = encryptor.encrypt(utenteDetails.password);
                utenteModelData.password = encryptedPassword;

                utenteModelData.save(function resultHandle(error, result) {
                    if (error) {
                        reject({ status: false, msg: "Errore durante la creazione dell'utente" });
                    } else {
                        resolve({ status: true, msg: "Utente creato con successo" });
                    }
                });
            }
        });
    });
}

// Funzione per il login dell'utente
module.exports.loginUtenteDBService = (utenteDetails) => {
    return new Promise(function myFn(resolve, reject) {
        utenteModel.findOne({ email: utenteDetails.email }, function getresult(errorvalue, result) {
            if (errorvalue) {
                reject({ status: false, msg: "Errore durante il login", token: '0', id: '0' });
            } else {
                if (result) {
                    const decryptedPassword = encryptor.decrypt(result.password);
                    if (decryptedPassword === utenteDetails.password) {
                        const payload = { email: result.email, id: result._id };
                        const options = { expiresIn: '6h' };
                        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
                        const body = {
                            status: true,
                            msg: "Utente validato con successo",
                            token: token,
                            id: result._id
                        };
                        resolve(body);
                    } else {
                        reject({ status: false, msg: "Password e/o email errati", token: '0', id: '0' });
                    }
                } else {
                    reject({ status: false, msg: "Dati non validi", token: '0', id: '0' });
                }
            }
        });
    });
}

// Nuova funzione per trovare un utente per email
module.exports.findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        utenteModel.findOne({ email: email }, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

// Nuova funzione per trovare il nickname per email
module.exports.findNicknameByEmail = (email) => {
    return new Promise((resolve, reject) => {
        // Trova un utente per email e seleziona solo il campo "nickname"
        utenteModel.findOne({ email: email }, 'nickname', (err, user) => {
            if (err) {
                reject(err);
            } else {
                // Controlla se l'utente è stato trovato
                if (user) {
                    resolve(user.nickname);
                } else {
                    // Se non trovato, risolvi con null o un altro valore predefinito
                    resolve(null);
                }
            }
        });
    });
}


// Funzione di logout
module.exports.logoutUtente = (req, res) => {
    // Invia una risposta di successo
    res.status(200).send({
        status: true,
        msg: "Logout avvenuto con successo"
    });
};


module.exports.generateResetToken = (email) => {
    console.log("Inizio generazione token per email:", email); // Log dell'email per cui si sta generando il token
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // Log del valore di JWT_SECRET

    return new Promise((resolve, reject) => {
        utenteModel.findOne({ email: email }, (err, user) => {
            if (err) {
                console.error("Errore durante la ricerca dell'utente:", err); // Log dell'errore se la ricerca fallisce
                reject({ status: false, msg: "Errore durante la ricerca dell'utente" });
            } else {
                if (!user) {
                    console.warn("Email non trovata:", email); // Log se l'email non è associata a nessun account
                    reject({ status: false, msg: "Email non associata ad alcun account" });
                } else {
                    console.log("Utente trovato, generazione token..."); // Log se l'utente viene trovato

                    // Genera un token JWT con una scadenza di 1 ora
                    const payload = { email: user.email };
                    const options = { expiresIn: '1h' };
                    const resetToken = jwt.sign(payload, process.env.JWT_SECRET, options);

                    console.log("Token generato:", resetToken); // Log del token generato
                    resolve({ status: true, msg: "Token generato con successo", resetToken: resetToken });
                }
            }
        });
    });
};
