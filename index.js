const express = require('express');
const app = express();
const port = 3002;
const connection = require('./conf');
const cors = require('cors');
let bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.get('/api/comments', (req, res) => {

    connection.query('SELECT * FROM comments', (err, results) => {
  
      if (err) {

        res.status(500).send('Erreur lors de la récupération des données');
      } else {
        res.json(results);
      }
    });
  });

app.post('/api/comments/add', (req, res) => {

  const name = req.body.name
  const comment = req.body.comment
  const stars = req.body.stars
  console.log(req.body, name, comment, stars)
  connection.query(`INSERT INTO comments(message, name, stars) VALUES ('${comment}', '${name}', '${stars}')`, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des données');
    } else {
      console.log('request send to database')    }
  })
}) ;

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});
