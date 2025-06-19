const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["conducteur", "expediteur", "admin"], default: "expediteur" },
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },

}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
