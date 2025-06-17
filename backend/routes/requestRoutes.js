const router = require("express").Router();
const requestController = require("../controllers/request.controller");
const auth = require("../middlewares/auth");

router.post("/", auth, requestController.sendRequest); // expéditeur
router.get("/my", auth, requestController.getMyRequests); // sender/receiver
router.get("/trip/:tripId", auth, requestController.getRequestsByTrip); // conducteur
router.put("/:id", auth, requestController.updateRequestStatus); // accept/refuse
router.delete("/:id", auth, requestController.deleteRequest);

module.exports = router;
