const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.disable("x-powered-by");

app.use(express.json());
