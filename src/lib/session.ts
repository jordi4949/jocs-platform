export const SESSION_COOKIE_NAME = "jocs_io_session";

const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(username: string) {
  const secret = process.env.APP_PASSWORD;

  if (!secret) {
    throw new Error("APP_PASSWORD is not configured.");
  }

  const payload = bytesToBase64Url(
    encoder.encode(
      JSON.stringify({
        sub: username,
        iat: Date.now(),
      }),
    ),
  );
  const signature = await hmac(payload, secret);

  return `${payload}.${signature}`;
}

export async function isValidSessionToken(token?: string) {
  if (!token || !token.includes(".")) {
    return false;
  }

  const secret = process.env.APP_PASSWORD;

  if (!secret) {
    return false;
  }

  const [payload, signature] = token.split(".");
  const expectedSignature = await hmac(payload, secret);

  return signature === expectedSignature;
}
