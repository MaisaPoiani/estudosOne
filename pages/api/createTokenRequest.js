import Ably from "ably/promises";

// criar um tokenRequest a partir da chave de API da Ably -> mantêm a chave original mais segura
export default async function handler(req, res) {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'ably-nextjs-demo' });
    res.status(200).json(tokenRequestData);
};