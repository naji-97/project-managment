import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognitoId: cognitoId,
      },

      include: {
        team: true,
        
      },
    });

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      cognitoId,
      email,
      profilePictureUrl = "i1.jpg",
      teamId = 1,
    } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { cognitoId } });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", existingUser });
    }
    const newUser = await prisma.user.create({
      data: {
        username,
        cognitoId,
        email,
        profilePictureUrl,
        teamId,
      },
    });
    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { cognitoId } = req.params;
  const { username, email, profilePictureUrl } = req.body;
  try {
    const isUserExists = await prisma.user.findUnique({ where: { cognitoId } });
    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updatedUser = await prisma.user.update({
      where: { cognitoId },
      data: {
        username: username ?? isUserExists.username,
        email: email ?? isUserExists.email,
        profilePictureUrl: profilePictureUrl ?? isUserExists.profilePictureUrl,

        
      },
      
      include: {
        team: true,
      },
    });
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating user: ${(error as Error).message}` });
  }
};
