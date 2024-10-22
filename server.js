//import required modules

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')


// load environemnt variables from .env file
dotenv.config();


// create Express application 
const app = express();
const PORT = process.env.PORT || 5000;

//middleware

app.use(cors()); //Enables CORS
app.use(express.json()); //parse JSON request bodies



//Sample API Endpoint

app.get('/api/data', (req, res) =>{
    res.json({ message: "Hello from AWS backend!"});
});

app.get('/api/', (req, res) =>{
    res.json({ message: "Hello AWS"});
});
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost: ${PORT}`);
});

