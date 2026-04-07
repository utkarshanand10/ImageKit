import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  // Forced re-compile: 2026-03-29 (ImageKit account auth fix)
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    console.log("ImageKit Debug LOG - Keys Check:", {
      hasPrivateKey: !!privateKey,
      publicKey: publicKey,
      privateKeyPrefix: privateKey ? privateKey.substring(0, 10) + "..." : "missing"
    });

    const authenticationParameters = getUploadAuthParams({
      privateKey: privateKey as string,
      publicKey: publicKey as string,
    });

    console.log("ImageKit Debug LOG - Auth Parameters Generated:", {
      token: authenticationParameters.token,
      expire: authenticationParameters.expire,
      signature: "present"
    });

    return Response.json({
      authenticationParameters,
      publicKey: publicKey || "",
    });
  } catch (error) {
    console.error("ImageKit Auth API Error - Detailed Logs:", error);
    return Response.json(
      {
        error: "Authentication for Imagekit failed",
        details: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
