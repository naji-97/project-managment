import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
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
      id,
      email,
      profilePictureUrl = "i1.jpg",
      teamId = 1,
    } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", existingUser });
    }
    const newUser = await prisma.user.create({
      data: {
        name: username, // Map username to the required name field
        username,
        id,
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
  const { id } = req.params;
  console.log(req.body);
  
  const { username, email } = req.body;

  try {
    
    const isUserExists = await prisma.user.findUnique({ where: { id: id } });
    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let profilePictureUrl = isUserExists.profilePictureUrl;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: "profile_pictures",
        public_id: `${id}_profile`,
        overwrite: true,
      });
      profilePictureUrl = uploadResponse.secure_url;
    }
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        username: username ,
        email: email ,
        profilePictureUrl: profilePictureUrl ,

        
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
