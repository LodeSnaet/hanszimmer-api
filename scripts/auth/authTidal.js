import dotenv from 'dotenv';
dotenv.config();

export const authTidal = async () => {
    const credentials = Buffer.from(
        `${process.env.TIDAL_CLIENT}:${process.env.TIDAL_SECRET_CLIENT}`
    ).toString('base64');

    const response = await fetch("https://auth.tidal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials"
    });

    if (!response.ok) {
        throw new Error(`Tidal authentication failed: ${response.status}`);
    }

    return response.json();
}
