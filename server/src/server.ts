import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

import { prisma } from "./prisma";

interface FeedbackBody {
  type: "BUG" | "IDEA" | "OTHER";
  comment: string;
  screenshot?: string;
}

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ac3a87712f324d",
    pass: "f166510b103f3e",
  },
});

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

    await transport.sendMail({
      from: "Equipe Feedget <oi@feedget.com>",
      to: "Murilo Cunha <murilo.sant@hotmail.com>",
      subject: "Novo feedback",
      html: [
        '<div style="font-family: sans-serif; font-size: 16px; color: #111;">',
        `<p>Tipo do feedback: ${type}</p>`,
        `<p>Comentário: ${comment}</p>`,
        "</div>",
      ].join("\n"),
    });

    return res.status(201).json({ data: feedback });
  }
);

app.listen(3333, () => {
  console.log("HTTP server running!");
});
