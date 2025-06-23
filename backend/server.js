const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const annonceRoutes = require("./routes/annonceRoutes");
const demandeRoutes = require("./routes/demandeRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const adminRoutes = require("./routes/admin.routes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
connectDB();
const app = express();

app.use(helmet());
app.disable("x-powered-by");
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/annonces", annonceRoutes);
app.use("/api/demandes", demandeRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Erreur serveur interne",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

module.exports = { app };
