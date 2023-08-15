"use server"; 

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface CreateThreadProps {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  author,
  communityId,
  path,
  text,
}: CreateThreadProps) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    //* Update User modal
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread : ${error.message}`);
  }
}
