import { NextApiRequest, NextApiResponse } from "next";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rpName = "webauthn-sample";
const rpID = "localhost";
const encoder = new TextEncoder();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await prisma.user.findUnique({
    where: { email: "testuser@example.com" }, // 認証済みユーザーのメールアドレス
  });

  if (!(user && user.name)) {
    return res.status(404).json({ error: "User not found" });
  }

  const registrationOptions = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: encoder.encode(user.name), // TODO 学習
    userName: user.email,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "required",
      authenticatorAttachment: "platform",
      requireResidentKey: true,
    },
  });

  await prisma.user.update({
    where: { email: "testuser@example.com" },
    data: { challenge: registrationOptions.challenge },
  });

  res.status(200).json(registrationOptions);
}
