const  {Client} = require('pg');
const dotenv = require('dotenv')
dotenv.config()

const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  process.env.HEROKU_HOST, // adresse du serveur
user :  process.env.HEROKU_USER, // le nom d'utilisateur
password :  process.env.HEROKU_PASSWORD, // le mot de passe
database :  process.env.HEROKU_DATABASE, // le nom de la base de données
});
module.exports = connection;
