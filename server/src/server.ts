import express, { Request, Response } from "express";
import { prisma } from "./prisma";

interface FeedbackBody {
  type: "BUG" | "IDEA" | "OTHER";
  comment: string;
  screenshot?: string;
}

const app = express();

app.use(express.json());

app.post(
  "/feedbacks",
  async (req: Request<{}, {}, FeedbackBody>, res: Response) => {
    const { type, comment, screenshot } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        type,
        comment,
        screenshot,
      },
    });

    return res.status(201).json({ data: feedback });
  }
);

app.listen(3333, () => {
  console.log("HTTP server running!");
});
