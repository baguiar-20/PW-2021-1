import express from "express";

import mainController from "../app/controllers/main"
import AreaController from "../app/controllers/area"
import cursoController from "../app/controllers/curso"

const router = express.Router();
const csrf = require('csurf')
var cookieParser = require('cookie-parser');
const csrfProtection = csrf({ cookie: true });


/// rota da main
router.get("/",                     mainController.index);
router.get("/about",                mainController.about);
router.get('/game',                 mainController.game);
router.get('/signup',                 mainController.signup);

// rota da area
router.get('/area',                 AreaController.index);

//rota do curso
router.get('/curso',                cursoController.index);
router.get('/curso/create',         cursoController.create);
router.post('/curso/create',        cursoController.create);

router.get('/curso/:id',            cursoController.read);
router.get('/curso/update/:id',     cursoController.update);
router.post('/curso/update/:id',    cursoController.update);

router.get('/curso/remove/:id',     cursoController.remove);


export default router;