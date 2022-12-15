require("dotenv").config()
const {authSecret} = require('./.env')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mysql = require("mysql")
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





    const signin = async (req, res) => {
        if (!req.body.email && !req.body.password){
            return res.status(400).send('informe usuário e senha')
        }
        
        
        let user;

        function createUserToken(value) {
            user = value;
            console.log(user.email, 'Logando com sucesso');
            res.json({
                ...user,
                token: jwt.sign(user, authSecret)   
            })
        }


        
        const sqlSelect =
            "SELECT * from users WHERE email = ?  AND password = ?"
            db.query(sqlSelect,[req.body.email, req.body.password], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result[0].idusers,'result id')
                const now =  Math.floor(Date.now() / 1000)

                const userInfo = {
                id:result[0].idusers ,
                email:result[0].email ,
                iat: now,
                exp: now + (60 * 60 * 24 * 3),
            }

            createUserToken(userInfo);

            }
            
        })

    }
    
    
    const validateToken = async (req, res, next) => {
        const tokenAndUser = req.body.token || null
        try{
            console.log(tokenAndUser)
            if(tokenAndUser){
                if(tokenAndUser.exp > Math.floor(Date.now() / 1000)) {
                    jwt.verify(tokenAndUser.token, authSecret, (err, decoded)=>{
                        if (err) return res.status(401)
                        // if (err) return res.status(401).end()
                    })
                    return await res.send(true)
                }else{
                    return await res.send(false)
                }
            }
        } catch(e){
            console.log(e)
        }
        
        
        console.log('FINALIZAMOS errado')
    
        res.send(false)
}
    module.exports = { signin, validateToken }


