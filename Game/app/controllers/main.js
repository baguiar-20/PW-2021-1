const models = require("../models/index");
const Curso = models.Curso;

// const cursos = require('../models/index')

// const bycrypt = require('bcryptjs');

// bycrypt.genSalt(rounds, function(err, salt){
//     bycrypt.hash(req.body.senha, salt, async(err, hash)=>{
//         await User.create({
//             nome: req.body.nome, 
//             email: req.body.email, 
//             senha: hash,
//             cursoId: req.body.cursoId
//         })
//     })
// })

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
	const cursos = await Curso.findAll();

	res.render('main/signup', {
		curso: cursos.map(c => c.toJSON),

	})
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

module.exports = {index, about, game, signup, logout}
//export default {index, about