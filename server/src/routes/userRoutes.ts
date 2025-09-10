import { getUser, getUsers, postUser, updateUser } from "../controllers/userController";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.get("/:cognitoId", getUser);
router.patch("/:cognitoId", updateUser);

export default router;