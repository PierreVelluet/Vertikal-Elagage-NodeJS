const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const connection = require('./conf');
const cors = require('cors');
let bodyParser = require('body-parser')
let router = express.Router();
let nodemailer = require('nodemailer');
const creds = require('./config');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.json())
app.use('/', router)
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


//Get all the comments from the comment table
app.get('/api/comments', (req, res) => {
    connection.query('SELECT * FROM comments', (err, results) => {
  
      if (err) {

        res.status(500).send('Erreur lors de la récupération des données');
      } else {
        res.json(results);
      }
    });
  });


//post the comment into the database
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


//
let transport = {
  host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
  port: 587,
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
if (error) {
  console.log(error);
} else {
  console.log('Server is ready to take messages');
}
});

router.post('/send', (req, res, next) => {
let name = req.body.name;
let email = req.body.email;
let message = req.body.message;
let phone = req.body.phone;
let content =
    `Nom: ${name}
    \n Email: ${email}
    \n Téléphone: ${phone}
    \n Message: ${message} `;

let mail = {
  from: name,
  to: 'velluetp@gmail.com',  // Change to email address that you want to receive messages on
  subject: "New Message from Verti'kal Elagage",
  text: content
}

transporter.sendMail(mail, (err, data) => {
  if (err) {
    res.json({
      status: 'fail'
    })
  } else {
    res.json({
     status: 'success'
    })

    transporter.sendMail({
    	from: "velluetl@gmail.com",
    	to: email,
    	subject: "Nous avons bien reçu votre demande !",
    	text: `Merci de nous avoir contacté ${name} ! Nous nous engageons à reprendre contact avec vous dans les 48 heures. Bonne journée !`
  }, function(error, info){
    	if(error) {
      	console.log(error);
    	} else{
      	console.log('Message sent: ' + info.response);
    	}
});



  }
})
})
app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});