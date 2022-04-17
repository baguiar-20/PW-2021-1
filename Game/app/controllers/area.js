const res = require('express/lib/response');
const models = require('../models/index')

const Area = models.Area;

async function index (req, res){
    const areas = await Area.findAll();
    areas.forEach(area => console.log(area.toJSON()));
    res.render("area/index", {
        areas: areas.map(area => area.toJSON())
    })
}



async function read (req, res){}
async function create (req, res){}
async function update (req, res){}
async function remove (req, res){}


module.exports = { index, read, create, update, remove }