import { NextApiRequest, NextApiResponse } from "next";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const expectedOrigin = "http://localhost:3000";
const expectedRPID = "localhost";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "testuser@example.com" },
    });

    if (!(user && user.challenge)) {
      return res.status(400).json({ error: "Challenge not found" });
    }

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: user.challenge,
      expectedOrigin,
      expectedRPID,
      requireUserVerification: true,
    });

    if (
      !(verification.verified && verification?.registrationInfo?.credential)
    ) {
      return res.status(400).json({ error: "Verification failed" });
    }

    const { id, publicKey, counter, transports } =
      verification.registrationInfo.credential;

    await prisma.user.update({
      where: { email: "testuser@example.com" },
      data: {
        challenge: null,
        authenticators: {
          create: {
            id: id,
            public_key: Buffer.from(publicKey).toString("base64"),
            counter: counter,
            transports: transports?.join(",") ?? "",
          },
        },
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
