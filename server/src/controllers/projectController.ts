import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

// controllers/projectController.ts
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('Request body:', req.body); // Add this to debug
  console.log('Request headers:', req.headers); // Check content-type
  
  const { name, description, startDate, endDate } = req.body;
  
  // Check if body is undefined
  if (!req.body) {
    res.status(400).json({ message: "Request body is undefined" });
    return;
  }
  
  try {
    // Validate required fields
    if (!name) {
      res.status(400).json({ message: "Project name is required" });
      return;
    }

    // Parse dates if they exist
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      },
    });
    
    res.status(201).json(newProject);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      message: "Failed to create project",
      error: error.message 
    });
  }
};