import express from 'express';
import router from './config/router';
import {v4 as uuidv4} from 'uuid';
// import csurf from 'csurf';

// como estamos usando expresss 4 é preciso instalar o body-parser
const bp = require('body-parser')
const sass = require('node-sass-middleware');
const handlebars = require("express-handlebars");
const morgan = require("morgan");
const app = express();
const PORT = 3000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get("/cookie", (req, res)=>{
    if(!("usuario" in req.cookies)){
        res.cookie('usuario', '1234')
        res.send("Usuario nao identificado. Criando Cookie agora!");
    }
    else{
        res.send(`Usuario nao identificado. Id ${req.cookies['usuario']}`);
    }

})

app.get("/apagar-cookie", (req, res) =>{
    res.clearCookie("usuario");
    res.send("cookie apagado");
})


const session =  require('express-session');

app.use(session({
    genid: (req) => {
        return uuidv4();
    }, 
    secret: 'Hi9Cf#mK98',
    resave: false,
    saveUninitialized: true
}));


// app.use('/webfonts', express.static(`${__dirname}/node_modules/@fortawesome/fontawesome-free/webfonts`));




app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine());
app.set("view engine","handlebars");

app.set("views", `${__dirname}/app/views`);

app.use("/img", express.static(`${__dirname}/public/img`))

app.use(sass({
    src: __dirname + '/public/scss',
    dest: __dirname + '/public/css',
    outputStyle: 'compressed',
    prefix: '/css',
    }));
    
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', [
    express.static(__dirname + '/node_modules/bootstrap/dist/js/'),
    express.static(__dirname + '/public/js')
    ]);
    
const csurf = require("csurf");
const csrfProtection = csurf({cookie: true});
app.use(csrfProtection);
    

app.use(router); // informando as rotas



app.use(morgan("combined"));

app.listen(PORT, ()=>{
    console.log(`Escutando na porta ${PORT}`)
});