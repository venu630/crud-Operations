const express = require("express");
require('dotenv').config();
const axios = require('axios').default;
const client = require('./configs/db');

const app = express();
app.use(express.json());

const port = 8000;

const baseUrl = process.env.BASE_URL

//ROUTES

//createContact
app.post('/createContact', (req, res) => {
    const {firstName, lastName, email, mobileNumber, dataStore} = req.body;
    
    if(dataStore === "database"){
      client.query(`INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES ('${firstName}', '${lastName}' , '${email}' , '${mobileNumber}');`
      )
      .then((data) => {
        
          res.status(200).json({ message: "Contact added successfully"});
      })
      .catch((err) => {
        console.log(err)
          res.status(400).json({ message: "DB error"});
      });
    }
    else{ 
    // FROM CRM
    }
})

//getContact
app.get('/getContact', (req, res) => {
  const {contact_id, dataStore} = req.body;
  if(dataStore === "database"){
    client.query(`SELECT * FROM contacts WHERE contact_id = ${contact_id};`
    )
    .then((data) => {
      const contactData = data.rows;
      const filteredData = contactData.map((info) => {
          return{
              first_name: info.first_name,
              last_name: info.last_name,
              email: info.email,
              mobile_number: info.mobile_number,
          };
      });
  
      res.status(200).json({ 
          message: "success",
          data: filteredData,
      });
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ message: "DB error"});
    });
  }
  else{
    // FROM CRM
  }
})

//updateContact
app.post('/updateContact', (req, res) => {
  const {contact_id, email, mobile_number, dataStore} = req.body;
  
  if(dataStore === "database"){
    client.query(`UPDATE contacts SET email = '${email}' , mobile_number = '${mobile_number}' WHERE contact_id = '${contact_id}';`
    )
    .then((data) => {
        res.status(200).json({ message: "Contact updated successfully"});
    })
    .catch((err) => {
      console.log(err)
        res.status(400).json({ message: "DB error"});
    });
  }
  else{
    // FROM CRM
  }
})

//deleteContact
app.post('/deleteContact', (req, res) => {
  const {contact_id, dataStore} = req.body;
  
  if(dataStore === "database"){
    client.query(`DELETE FROM contacts WHERE contact_id = '${contact_id}';`
    )
    .then((data) => {
        res.status(200).json({ message: "Contact deleted successfully"});
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ message: "DB error"});
    });
  }
  else{
    // FROM CRM
  }
})





client.connect(() => {
  console.log("connected to db");

});

app.listen(port, () =>{
    console.log(`server is running on ${port}`);
});