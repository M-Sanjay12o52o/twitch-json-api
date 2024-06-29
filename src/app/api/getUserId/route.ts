import { NextResponse } from "next/server";

// const TWITCH_API_URL = 'https://api.twitch.tv/helix/users';
const TWITCH_API_URL = 'https://twitch-proxy.freecodecamp.rocks/helix/users'
const CLIENT_ID = '5qy56shg10z7dcdfxv2oawmhrai47j';
const OAUTH_TOKEN = 'oauhill93jdx171yeej9lrbme833hj';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const login = searchParams.get('login');

    console.log("login: ", login);

    if (!login) {
        return NextResponse.json({ error: 'Login Parameter is required' }, { status: 400 });
    }

    try {
        const res = await fetch(`${TWITCH_API_URL}?login=${login}`, {
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

        console.log("data: ", data);

        return NextResponse.json({ data });
    } catch (error) {
        console.error(`Error fetching Twitch data: ${error}`);
        return NextResponse.json({ error: 'Failed to fetch data from Twitch' }, { status: 500 });
    }
}
