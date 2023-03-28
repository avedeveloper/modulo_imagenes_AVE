import { Router } from "express";
import multer from "multer";

const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.BASE_PATH_IMAGES}/variants`); // Ruta donde se guardará la imagen
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
});
const variants = multer({storage: storage});


router.post("/", variants.array('image'), async function (req, res, next) {
  try {
    const imagesPath = req.files.map((e) => {
      return {path:`${process.env.URL_PATH}/variants/${e.filename}`,name:e.originalname.split(".")[0]}
    })
    res.status(200).json({message: "Images Uploaded",data:{images: imagesPath}})
  } catch (error) {
    res.status(400).json({error: error})
  }
});




export default router;