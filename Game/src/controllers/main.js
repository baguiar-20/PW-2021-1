

const index = (req, res) => {
	res.render("main/index", {layout: false});
}


const sobre = (req, res) => {
	res.render("main/sobre");
}


export default {index, sobre};