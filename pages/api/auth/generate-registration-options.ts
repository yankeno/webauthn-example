import { NextApiRequest, NextApiResponse } from "next";
import {
  AuthenticatorTransportFuture,
  generateRegistrationOptions,
} from "@simplewebauthn/server";
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
    include: { authenticators: true },
  });

  if (!(user && user.name)) {
    return res.status(404).json({ error: "User not found" });
  }

  const registrationOptions = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: encoder.encode(user.name),
    userName: user.email,
    attestationType: "none",
    // 認証機の重複登録防止
    excludeCredentials: user.authenticators.map((authenticator) => ({
      id: authenticator.id,
      type: "public-key",
      transports: authenticator.transports.split(
        ",",
      ) as AuthenticatorTransportFuture[],
    })),
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
