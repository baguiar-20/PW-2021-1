import express from "express";

import mainController from "../app/controllers/main"
import AreaController from "../app/controllers/area"
import cursoController from "../app/controllers/curso"
import jogoController from "../app/controllers/jogo"
import authCheck from "../app/utils/authCheck"

const router = express.Router();



/// rota da main
router.get("/",                     mainController.index);
router.get("/about",                mainController.about);

router.get('/signup',                 mainController.signup);
router.post('/signup',                 mainController.signup);

router.get('/login',                 mainController.login);
router.post('/login',                 mainController.login);

router.get('/logout',                 mainController.logout);
router.post('/logout',                 mainController.logout);

// rota da area
router.get('/area',                 AreaController.index);

//rota do curso
router.get('/curso',  authCheck,                cursoController.index);
router.get('/curso/create',   authCheck,        cursoController.create);
router.post('/curso/create',   authCheck,       cursoController.create);

router.get('/curso/:id',   authCheck,           cursoController.read);
router.get('/curso/update/:id',  authCheck,     cursoController.update);
router.post('/curso/update/:id',  authCheck,    cursoController.update);
router.get('/curso/remove/:id',   authCheck,    cursoController.remove);
// router.delete('/curso/remove/:id',     cursoController.remove);


// rota jogo

router.get('/jogo',                 jogoController.index);
router.get('/jogo/ranking',         jogoController.ranking);
router.get('/jogo/save',            jogoController.save);
router.get('/jogo/game',            jogoController.game);


export default router;