import express from "express";
import axios from "axios";
import fs from "fs"
import multer from "multer";
import Papa from "papaparse"
var router = express.Router();
import dotenv from "dotenv"
var config = dotenv.config();
global.config = config.parsed;

export default router;

// Configurar multer para manejar la carga de archivos
const uploads = multer();

router.post("/", uploads.single("csv"),async function (req, res, next) {
  try{
    const buffer = req.file.buffer
    const csv = buffer.toString()
    const json = Papa.parse(csv, {header: true}).data
    const aph = await axios.post(`${global.config.URL_PATH_APH}`, json)
    console.log(aph.data)
    res.status(200).json(aph.data)
  }catch(err){
    console.log(err)
    res.status(400).send(err.message)
  }
})