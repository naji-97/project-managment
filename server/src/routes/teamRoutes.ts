import { Router } from "express";
import { getTeams, postTeam } from "../controllers/teamController";

const router = Router();

router.get("/", getTeams);
router.post("/", postTeam);

export default router;