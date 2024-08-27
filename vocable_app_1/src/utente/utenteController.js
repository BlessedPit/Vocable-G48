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

var forgotPasswordControllerFn = async (req,res) => {
    try {
        const templateParams = {
            to_email: req.email,
            message: 'pallw',
          };
          result = await(utenteService.sendEmailFn(templateParams));
          if(result.status){
            console.log("true");
            res.send({"status":true,"message":result.message});
          } else {
            console.log("false");
            res.send({"status":false,"message":result.message});
          }     
    } catch (error){
        console.log(error);
        res.status(500).json({message: error});
    }
}

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


module.exports = { createUtenteControllerFn, loginUtenteControllerFn, meUtenteControllerFn, logoutUtenteControllerFn,forgotPasswordControllerFn  };
