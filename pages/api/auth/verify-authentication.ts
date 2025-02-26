import { NextApiRequest, NextApiResponse } from "next";
import {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const expectedOrigin = "http://localhost:3000";
const expectedRPID = "localhost";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const response: AuthenticationResponseJSON = req.body;
    const user = await prisma.user.findUnique({
      where: { email: "testuser@example.com" }, // 認証済みユーザーのメールアドレス
      include: { authenticators: true },
    });

    if (!(user && user.challenge)) {
      return res.status(404).json({ error: "User not found" });
    }

    const authenticator = user.authenticators.find(
      (authenticator) => authenticator.id === response.id,
    );

    if (!authenticator) {
      return res.status(404).json({ error: "Authenticator not found" });
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: user.challenge,
      expectedOrigin,
      expectedRPID,
      requireUserVerification: true,
      credential: {
        id: response.id,
        publicKey: Buffer.from(authenticator?.public_key, "base64"),
        counter: authenticator?.counter,
        transports: authenticator?.transports.split(
          ",",
        ) as AuthenticatorTransportFuture[],
      },
    });

    if (!verification.verified) {
      return res.status(400).json({ error: "Authentication failed" });
    }

    prisma.user.update({
      where: { email: "testuser@example.com" },
      data: {
        challenge: null,
      },
    });

    res.status(200).json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).json({ error: error });
  }
}
