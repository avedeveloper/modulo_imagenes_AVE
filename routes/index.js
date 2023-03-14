import express from "express";
import multer from "multer";
var router = express.Router();
import dotenv from "dotenv"
var config = dotenv.config();
global.config = config.parsed;
// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${process.env.BASE_PATH_IMAGES}/logos`); // Ruta donde se guardará la imagen
  },
  filename: function(req, file, cb) {
    cb(null,Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
});
const storage_products = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${process.env.BASE_PATH_IMAGES}/products`); // Ruta donde se guardará la imagen
  },
  filename: function(req, file, cb) {
    cb(null,Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
})

const logo = multer({storage});
const produts = multer({storage_products})
export default router;

router.post("/create_logo_user",logo.single('image'),async function (req, res,next) {
  try{
    const {logo} = req.body;
    console.log("logo",logo)
    res.status(200).json({message:"ok"})

  }catch(err){
    res.status(400).json({error:err.message})
  }
})
router.post("/create_image_product",produts.single('image'),async function(req,res){
  try{
    const {logo} = req.body;
    console.log("logo",logo)
    res.status(200).json({message:"ok"})

  }catch(err){
    res.status(400).json({error:err.message})
  }
})