import { jwtVerify, SignJWT } from "jose";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET environment variable is not defined. Cannot start the application.");
}

const SECRET = new TextEncoder().encode(rawSecret);

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Invalid token: " + errorMessage);
  }
};

export const signToken = async (payload: { userId: string, username: string, email?: string }) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
};