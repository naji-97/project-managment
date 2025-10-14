import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();
    console.log("Fetched teams:", teams);
    
    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        // Only fetch product owner if the ID exists and is not null
        let productOwnerUsername = null;
        if (team.productOwnerUserId) {
          const productOwner = await prisma.user.findUnique({
            where: { id: team.productOwnerUserId.toString() },
            select: { name: true },
          });
          productOwnerUsername = productOwner?.name || null;
        }
        console.log("Product Owner Username:", productOwnerUsername);
        
        
        // Only fetch project manager if the ID exists and is not null
        let projectManagerUsername = null;
        if (team.projectManagerUserId) {
          const projectManager = await prisma.user.findUnique({
            where: { id: team.projectManagerUserId.toString() },
            select: { name: true },
          });
          projectManagerUsername = projectManager?.name || null;
          console.log("Project Manager Username:", projectManagerUsername);
        }
        
        return {
          ...team,
          productOwnerUsername: productOwnerUsername,
          projectManagerUsername: projectManagerUsername,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving teams: ${error.message}` });
  }
};

export const postTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
    const team = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId,
        projectManagerUserId,
      },
    });
    res.json(team);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating team: ${error.message}` });
  }
};