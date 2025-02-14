const express = require("express");
const router = express.Router();
const { authenticate, authorizeRole } = require("../config/authMiddleware");
const eventController = require("../controllers/eventController");

// listar os eventos
router.get("/", eventController.listEvents);

router.get("/:id", eventController.show); 

router.get("/create", eventController.renderForm); 

// Apenas usuários logados podem criar eventos
router.post("/create", authenticate, eventController.create);

// Exclusão de evento (somente o criador do evento ou administrador pode excluir)
router.post("/:id/delete", authenticate, eventController.deleteEvent);

router.post("/:id/edit", eventController.update);


module.exports = router;
