

async function index(req,res){
    res.render("jogo/index")
}


async function ranking(req,res){
    res.render("jogo/ranking")
}
 

async function save(req,res){
    res.render("jogo/save")
}

async function game(req,res){
    res.render("jogo/game")
}


module.exports = { index, ranking, save, game}