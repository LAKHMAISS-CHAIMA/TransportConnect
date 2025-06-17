const router = require("express").Router();
const tripController = require("../controllers/trip.controller");
const auth = require("../middlewares/auth");

router.post("/", auth, tripController.createTrip); // conducteur
router.get("/", tripController.getAllTrips);       // public
router.get("/:id", tripController.getTripById);
router.put("/:id", auth, tripController.updateTrip); 
router.delete("/:id", auth, tripController.deleteTrip);

module.exports = router;
