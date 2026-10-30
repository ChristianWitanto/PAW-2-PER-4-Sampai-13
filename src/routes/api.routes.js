import express from 'express'
import FakultasController from '../controllers/fakultas.controller.js'
import ProdiController from '../controllers/prodi.controller.js'
import AuthController from '../controllers/auth.controller.js'
import { authenticateJwt } from '../middleware/auth.js'


import upload from '../config/upload.js'
import UploadController from '../controllers/upload.controller.js'
import UserController from '../controllers/user.controller.js'
import WelcomeController from '../controllers/welcome.controller.js'
import LogMiddleware from '../middleware/log.middleware.js'


const router = express.Router()

router.use(LogMiddleware)
router.get('/welcome', WelcomeController.welcome)
router.post('/users', UserController.store)
router.post('/upload', upload.single('file'), UploadController.store)

router.post('/sign-up', AuthController.register) 
router.post('/sign-in', AuthController.login) 
router.use(authenticateJwt) // Apply JWT authentication middleware to all routes below

router.get('/fakultas',FakultasController.index)
router.get("/fakultas/:id",FakultasController.show)
router.post("/fakultas",FakultasController.store)
router.put("/fakultas/:id",FakultasController.update)
router.patch("/fakultas/:id",FakultasController.update) 
router.delete("/fakultas/:id",FakultasController.delete)


router.get('/prodi', ProdiController.index)
router.get('/prodi/:id', ProdiController.show)
router.put('/prodi/:id', ProdiController.update)
router.patch('/prodi/:id', ProdiController.update)
router.delete('/prodi/:id', ProdiController.delete)
router.post('/prodi', ProdiController.store)

export default router
