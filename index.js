const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");
const jwt = require("jsonwebtoken");


const JWTSecret = "jkfsdajhgsahweoiwqaoe15823182"
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Middleware
function auth(req, res, next){
    const authToken = req.headers['authorization'];
    if (authToken != undefined) {
        let bear = authToken.split(' ');
        let token = bear[1];

        jwt.verify(token, JWTSecret, (err, data) => {
            if (err) {
                res.status(401).json({err: "token invalido"})
            } else {
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }
        });

    } else { 
        res.status(400).send("Token Inválido");
    }
   
};

//console.log(db.db)




// Rotes
app.get("/games", auth, (req, res) => {
    res.status(200).json({user: req.loggedUser, games: db.db.games})
});

app.get("/game/:id", (req, res) => {
    const id = req.params.id;

    if(isNaN(id)) {
        res.status(400).send("Isso não é um numero");
    } else {
        const id = +req.params.id;

        let game = db.db.games.find(g => g.id == id)

        if (game != undefined) {
            res.status(200);
            res.json(game);
        } else {
            res.status(404)
        }

    }

});

app.post("/game", auth, (req, res) => {
    const {title, price, year} = req.body;

    db.db.games.push({
       id: 2323,
       title,
       price,
       year 
    });

    res.status(200).send("Cadas com sucesso!")
});

app.delete("/game/:id", auth, (req, res) => {
    const id = req.params.id;

    if(isNaN(id)) {
        res.status(400).send("Isso não é um numero");
    } else {
        const id = +req.params.id;

        let index = db.db.games.findIndex(g => g.id == id);

        if(index == -1) {
            res.status(404).send("prog não exis");;
        } else {
            db.db.games.splice(index, 1);
            res.sendStatus(200);

        }
      
    };
});

app.put("/game/:id", auth,(req, res) => {
    const id = req.params.id;

    if(isNaN(id)) {
        res.status(400).send("Isso não é um numero");
    } else {
        const id = +req.params.id;

        let game = db.db.games.find(g => g.id == id)

        if (game != undefined) {
            const {title, price, year} = req.body;

            
        if ( title != undefined) {
            game.title = title;
        }
        if (price != undefined) {
            game.price = price;
        }
        if (year != undefined) {
            game.year = year;
        }
            res.status(200);
            res.json(game);
        } else {
            res.status(404)
        } 
      
    };
});

app.post("/auth", (req, res) => {
    const {email, password} = req.body;

    if(email != undefined) {
        let user = db.db.users.find(u => u.email === email);
        if(user != undefined) {
            if(user.password == password) {
                jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn: '48h'},(err, token) => {
                    if (err) {
                        res.status(400).json({err: "Falha interna!"})
                    } else {
                        res.status(200).json({token})
                    }
                });

            } else {
                res.status(401).json({token: "Credenciais invalidas!"})
            }

        }else {
            res.status(404).json({err: "O E-mail enviado não exise na base de dados"})
        }
    } else {
         res.status(400).json({err: "O E-mail enviado é invalido"})
    }
});


app.listen(8080, () => {
    console.log("API Rodando!")
});
