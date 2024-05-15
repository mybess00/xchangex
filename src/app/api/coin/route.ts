import { NextResponse } from "next/server";

const BASE_URL = 'https://api.yadio.io'
type BodyRequest = {
    currency: string
}
export const config = {
    runtime: 'experimental-edge'
}
export async function POST(req: Request) {
    const body : BodyRequest = await req.json()
    const response = await fetch(`${BASE_URL}/exrates/${body.currency}`, {
        method: 'GET',
        next: {revalidate: 28800}
    })
    if (!response.ok) {
        console.log(response)
        throw new Error('Error 002: GET on api/coin/route.ts')
    }
    const data = await response.json()
    return NextResponse.json({data})
}