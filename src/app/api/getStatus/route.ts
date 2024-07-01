import { NextResponse } from "next/server";

const CLIENT_ID = '5qy56shg10z7dcdfxv2oawmhrai47j';
const OAUTH_TOKEN = 'oauhill93jdx171yeej9lrbme833hj';

const GET_STATUS_URL = "https://twitch-proxy.freecodecamp.rocks/helix/streams?user_id="

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
        return NextResponse.json({ error: 'user_id Parameter is required' }, { status: 400 });
    }

    try {
        const res = await fetch(`${GET_STATUS_URL}${user_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${OAUTH_TOKEN}`,
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        console.log("data getStatus: ", data);

        return NextResponse.json({ data });
    } catch (error) {
        console.error(`Error fetching Twitch data: ${error}`);
        return NextResponse.json({ error: 'Failed to fetch data from Twitch' }, { status: 500 });
    }
}
