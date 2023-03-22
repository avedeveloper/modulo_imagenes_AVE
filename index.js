import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import express_session from "express-session";
import api from "./routes/index.js";
import csv from "./routes/csv.js"
var config = dotenv.config();
global.config = config.parsed;



console.log("----------- AVE BACKEND ---------------");
// VERIFICATION ENV
console.log("----------- CHECK ENV");
var required_env_variables = [
  "PORT",
  "environment"
];
var err = false;
required_env_variables.map((e) => {
  if (!process.env[e]) {
    err = true;
    console.error("ERROR: falta variable env:", e);
  }
});
if (err) {
  console.log("----------- ERROR --------------");
  process.exit(1);
}

console.log("----------- SUCCESS ENV");

// CONFIG EXPRESS
const app = express();
const server = http.Server(app);


if (process.env.environment == "development") {
  console.log("----------- DEVELOPE MODE -------------");
  var corsOptions = {
    credentials: true,
    origin: [
      "http://localhost:9528",
      "http://localhost:3000",
      "http://localhost:9529",
      "http://localhost:9530",
      "http://localhost:9531",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
    ],
  };
  app.use(cors(corsOptions));
  console.log("----------- CORS ENABLED");
} else {
  console.log("----------- PRODUCTION MODE -------------");
  app.use(cors());
}

/*access controll allow origin */
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.use(express_session({
  secret: "session_secret",
  resave: false,
  saveUninitialized: true,
}));

app.use("", api);
app.use("/csv", csv);

console.log("Servidor API escuchando en       ", process.env.PORT);
console.log("Environment mode", process.env.environment);
server.listen(process.env.PORT);