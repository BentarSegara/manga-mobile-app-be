import express from "express";
import {
  deleteUser,
  editUser,
  login,
  register,
} from "../controllers/user-controller.js";

const router = express.Router();

router.get("/", (_, res) => {
  return res.status(404).send("There is nothing here");
});
router.post("/login", login);
router.post("/register", register);
router.patch("/update/:id", editUser);
router.delete("/delete/:id", deleteUser);

export default router;
