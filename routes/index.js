import express from "express";
import multer from "multer";
import axios from "axios";
var router = express.Router();
import fs from "fs"
import dotenv from "dotenv"
var config = dotenv.config();
global.config = config.parsed;
// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.BASE_PATH_IMAGES}/logos`); // Ruta donde se guardará la imagen
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
});

const logo = multer({ storage });
const upload = logo.single('image')
const products = multer({ storage:multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.BASE_PATH_IMAGES}/products`); // Ruta donde se guardará la imagen
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
})});
const uploadProducts = products.single('image')
const variants = multer({ storage:multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.BASE_PATH_IMAGES}/variants`); // Ruta donde se guardará la imagen
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
})});
const uploadVariants = variants.single('image')

router.post("/create_logo_user", logo.single('image'), async function (req, res, next) {
  try {
    const { id_wordpress } = req.body
    // console.log(req.headers)
    const token = req.headers['authorization-token']
    const api_key = req.headers['authorization']
    console.log("aca")
    if (!id_wordpress || !token) {
      throw new Error("id_wordpress or token not found")
    }
    console.log("aca")

    const response = await axios.post(`${process.env.URL_ADMIN_SERVICE}`, {
      id_wordpress: req.body.id_wordpress,
      path: `${process.env.URL_PATH}/logos/${req.file.filename}`
    },
    {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `${api_key}`,
        'authorization-token': `${token}`
      }
    }
    )
    if (response.data.err.length > 0) {
      res.status(400).json({ error: response.data.err })
    }
    console.log("aca")

    res.status(200).json({
      message: "ok", data: {
        path: `${process.env.URL_PATH}/logos/${req.file.filename}`,
        id_wordpress: req.body.id_wordpress
      }
    })

  } catch (err) {
    // console.log(err)
    // console.log(err.response.data.message)
    res.status(400).json({ error: err.response })
  }
})
router.post("/create_image_product", async function (req, res,next) {
  try {
    console.log("aca")
    uploadProducts(req, res, async function (err) {
      if (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
      }
      // console.log(err)
      // console.log(req)
      console.log("ok")
      res.status(200).json({
        message: "ok", data: {
          path: `${process.env.URL_PATH}/products/${req.file.filename}`,
        }
      })
    })
    
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post("/create_image_variant_product",async function(req,res,next){
  try{
    uploadVariants(req, res, async function (err) {
      if (err) {
        throw new Error(err.message)
      }
      // console.log(err)
      // console.log(req)
      console.log("ok")
      res.status(200).json({
        message: "ok", data: {
          path: `${process.env.URL_PATH}/variants/${req.file.filename}`,
        }
      })
    })
  }catch(err){
    res.status(400).json({ error: err.message })
  }
})

router.post("/delete_image_product", async function (req, res, next) {
  try{
    const {path} = req.body
    if(!path){
      throw new Error("path not found")
    }
    fs.unlinkSync(`${process.env.BASE_PATH_IMAGES}/products/${path.split("/").pop()}`)
    res.status(200).json({message:"ok"})
  }catch(err){
    console.log(err)
    res.json({error:err.message})
  }
})
router.post("/delete_image_variant_product", async function (req, res, next) {
  try{
    const {path} = req.body
    if(!path){
      throw new Error("path not found")
    }
    fs.unlinkSync(`${process.env.BASE_PATH_IMAGES}/variants/${path.split("/").pop()}`)
    res.status(200).json({message:"ok"})
  }catch(err){
    console.log(err)
    res.json({error:err.message})
  }
})
export default router;