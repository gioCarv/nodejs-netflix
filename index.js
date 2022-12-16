require("dotenv").config()
const express = require("express")
const app = express()
const mysql = require("mysql")
const cors = require("cors")
const bodyParser = require("body-parser");
const auth = require('./auth')
const port = process.env.PORT || 3002
const host = process.env.DB_host
const user = process.env.DB_user
const password = process.env.DB_password
const database = process.env.DB_database

const db = mysql.createPool({
    host,
    user,
    password,
    database,
})


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.post('/signup',(req, res) => {
    const {email} = req.body
    const {password} = req.body

    let sqlInsert =
    "INSERT INTO users (email, password) VALUES (?, ?);";
    db.query(sqlInsert, [email, password], (err,result) => {
        if (err) console.log(err)
    })
})


 app.get( '/', (req,res)=> {
    const sqlSelect = 
    "SELECT email from users "
    db.query(sqlSelect, (err,result) =>{
        if (err) console.log(err)      
        res.send(result)
    })
})

 app.get( '/get/', (req,res)=> {
    const sqlSelect = 
    "SELECT email from users "
    db.query(sqlSelect, (err,result) =>{
        if (err) console.log(err)      
        res.send(result)
    })
})

app.get( '/get/:email', (req,res)=> {
    const email = req.params.email
    const sqlSelect = 
    "SELECT email from users WHERE email = ?"
    db.query(sqlSelect, email, (err,result) =>{
        console.log(result)
        if (err) console.log(err)
       res.send(result)
   })
})


app.post( '/signin', auth.signin)

app.post( '/home', auth.validateToken)


app.post( '/userEmail', (req,res)=> {
    const email = req.body.email
    
    const sqlSelectEmail = 
    "SELECT email from users WHERE email = ?"
    
    db.query(sqlSelectEmail, [email], (err,result) =>{
        if (err) console.log(err)
        try{
            
        if (result[0].email){
              res.send(true)
        }}catch{
            res.send(false)
        }
        
    })
})



app.post( '/user', (req,res)=> {
    const email = req.body.email
    const password = req.body.password



    const sqlSelect =    
    "SELECT email from users WHERE email = ? AND password = ?"
    db.query(sqlSelect, [email, password], (err,result) =>{
        if (err) console.log(err)
        try{
            if(result[0].email){
                res.send(true)
            }
        }catch{
            res.send(false)            
        }
        
        })
    })



    



app.listen(port, ()=> {
    console.log(`Rodando na porta 3002`)
})
