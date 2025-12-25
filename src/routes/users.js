import express from "express";
import {
  checkUserEmail,
  deleteUser,
  editUser,
  editUserPassword,
  login,
  register,
} from "../controllers/user-controller.js";

const router = express.Router();

router.get("/", (_, res) => {
  return res.status(404).send("There is nothing here");
});
router.post("/login", login);
router.post("/register", register);
router.post("/confirm-email", checkUserEmail);
router.patch("/reset-password", editUserPassword);
router.patch("/:id/update", editUser);
router.delete("/:id/delete", deleteUser);

export default router;
