import { getUser, getUsers, postUser } from "../controllers/userController";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.get("/:cognitoId", getUser);

export default router;