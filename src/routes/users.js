import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/user-controller.js";

const router = express.Router();

router.get("/", (_, res) => {
  return res.status(404).send("There is nothing here");
});
router.get("/:id", getUser);
router.post("/store", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
