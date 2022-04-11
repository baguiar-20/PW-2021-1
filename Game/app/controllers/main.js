

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

module.exports = {index, about, game}
//export default {index, about};