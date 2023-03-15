import express from "express";
import multer from "multer";
import axios from "axios";
var router = express.Router();
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
const storage_products = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.BASE_PATH_IMAGES}/products`); // Ruta donde se guardará la imagen
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
})

const logo = multer({ storage });
const produts = multer({ storage_products })
export default router;

router.post("/create_logo_user", logo.single('image'), async function (req, res, next) {
  try {
    const { id_wordpress } = req.body
    // console.log(req.headers)
    const token = req.headers['authorization-token']
    const api_key = req.headers['authorization']
    // console.log(token,api_key,"hola mundo")
    if (!id_wordpress || !token) {
      throw new Error("id_wordpress or token not found")
    }

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
    if(response.data.err.length > 0){
      res.status(400).json({ error: response.data.err })
    }
    res.status(200).json({
      message: "ok", data: {
        path: `${process.env.URL_PATH}/logos/${req.file.filename}`,
        id_wordpress: req.body.id_wordpress
      }
    })

  } catch (err) {
    // console.log(err)
    // console.log(err.response.data.message)
    res.status(400).json({ error: err.response.data.message })
  }
})
router.post("/create_image_product", produts.single('image'), async function (req, res) {
  try {
    res.status(200).json({ message: "ok", data: `${process.env.URL_PATH}/products/${req.file.filename}` })

  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})