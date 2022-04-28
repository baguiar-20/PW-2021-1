// import { Cursos, Usuario } from '../models/index';

// import from 'bcryptjs';

const bcrypt  = require('bcryptjs');

const models = require("../models/index");
const Cursos = models.Curso;
const Usuario = models.User;


const index = (req, res) => {
	const conteudo = 'Pagina principal da aplicação';
	res.render("main/index", {
		titulo: conteudo,
	
	});
}


const about = (req, res) => {
	const conteudo = 'Pagina sobre da aplicação';
	res.render("main/about", {
		titulo: "Pagina sobre da aplicação",
	
	});
}

const game = (req, res) => {
    res.render('main/game',{
        titulo: 'Skifree'
    });
}


const signup = async (req, res) =>{
	const cursos = await Cursos.findAll();
	if(req.route.methods.get){
		res.render('main/signup', {
			cursos: cursos.map(curso => curso.toJSON()),
			csrf: req.csrfToken()
		})
	}
	else{
		const usuario = req.body;
		console.log(usuario.nome);

		try{
			bcrypt.genSalt(10, (errorSalt, salt) =>{
				bcrypt.hash(usuario.senha, salt, async(error, hash)=>{
					await Usuario.create({
						nome: usuario.nome,
						email: usuario.email,
						senha: hash,
						cursoId: usuario.cursoId
					});
				})
			})
			
			res.redirect('/');
		} catch(error){
			console.log(error);
		}
	}
	
}

const login = async (req, res) =>{
	if(req.route.methods.get)
	res.render("main/login", {
		csrf: req.csrfToken()
	})
	else{
		const credentials = req.body;
		// console.log("crende " + credentials.senha);
		const user = await Usuario.findOne({where: {email: credentials.email}})
		// console.log("user " +user.senha);
		if(user){
			bcrypt.compare(credentials.senha, user.senha, (error, sucess)=>{ //de alguma maneira da false
				// console.log(sucess);
				// console.log(error);
				if(error) console.log(error);
				else if(!sucess){
					// console.log(sucess);
					req.session.uid = user.id;
					res.redirect('/jogo');
				}
				else{
					// console.log("ultimo else");
					res.render('main/login', {
						csrf: req.csrfToken()
					})
				}
			})
		}
		else{
			res.render('main/login', {
				csrf: req.csrfToken()
			})
		}
	}
}

const logout = async (req, res) =>{
	req.session.destroy(function(err){
		if(err){
			return console.log(err);
		}
		else{
			res.redirect('/');
		}
	})
}

module.exports = {index, about, game, signup, logout, login}
