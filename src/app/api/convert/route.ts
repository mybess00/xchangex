import { NextResponse } from "next/server";

const BASE_URL = 'https://api.yadio.io'
type BodyRequest = {
    amount: string,
    from: string,
    to: string
}
export const runtime = 'edge'
export async function POST(req: Request) {
    const body : BodyRequest = await req.json()
    const response = await fetch(`${BASE_URL}/convert/${body.amount}/${body.from}/${body.to}`, {
        method: 'GET',
        next: {revalidate: 28800}
    })
    if (!response.ok) {
        console.log(response)
        throw new Error()
    }
    const data = await response.json()
    return NextResponse.json({data})
}