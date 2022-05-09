import express, { Request, Response } from "express";

import { NodemailerMailAdapter } from "./adapters/nodemailer/nodemailer-mail-adapter";
import { PrismaFeedbacksRepository } from "./repositories/prisma/prisma-feedbacks-repository";

import {
  SubmitFeedbackUseCase,
  SubmitFeedbackUseCaseRequest,
} from "./use-cases/submit-feedback-use-case";

export const routes = express.Router();

routes.post(
  "/feedbacks",
  async (req: Request<{}, {}, SubmitFeedbackUseCaseRequest>, res: Response) => {
    const { type, comment, screenshot } = req.body;

    const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
    const nodeMailerMailAdapter = new NodemailerMailAdapter();

    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
      prismaFeedbacksRepository,
      nodeMailerMailAdapter
    );

    await submitFeedbackUseCase.execute({ type, comment, screenshot });

    return res.status(201).send();
  }
);
