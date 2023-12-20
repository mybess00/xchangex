import { NextResponse } from "next/server";

type BodyRequest = {
  coin: string
}

export interface APIResponse {
  graph: Graph[];
}

export interface Graph {
  price: number;
  date:  string;
}

const API_KEY = ''

export async function POST (req: Request) {
  const body : BodyRequest = await req.json()

  const response = await fetch(`https://serpapi.com/search.json?engine=google_finance&q=${body.coin}-USD&hl=en&api_key=${API_KEY}`, {
    method: 'GET',
    next: {revalidate: 28800}
  })
  if (!response.ok) {
    console.log(response)
    throw new Error('Error 006: POST on api/chart/route.ts')
  }
  const data : APIResponse = await response.json()
    
  return NextResponse.json({graph: data.graph})
}