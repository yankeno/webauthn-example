import { NextApiRequest, NextApiResponse } from "next";
import {
  AuthenticatorTransportFuture,
  generateAuthenticationOptions,
} from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rpID = "localhost";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await prisma.user.findUnique({
    where: { email: "testuser@example.com" }, // 認証済みユーザーのメールアドレス
    include: { authenticators: true },
  });

  if (!(user && user.authenticators)) {
    return res.status(404).json({ error: "User not found" });
  }

  const registrationOptions = await generateAuthenticationOptions({
    rpID,
    timeout: 60000,
    userVerification: "preferred",
    allowCredentials: user.authenticators.map((authenticator) => ({
      id: authenticator.id,
      transports: authenticator.transports.split(
        ",",
      ) as AuthenticatorTransportFuture[],
    })),
  });

  await prisma.user.update({
    where: { email: "testuser@example.com" },
    data: { challenge: registrationOptions.challenge },
  });

  res.status(200).json(registrationOptions);
}
