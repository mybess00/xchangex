import { NextResponse } from "next/server";

type BodyRequest = {
  coin: string
}

export interface SerpApi {
  graph: Graph[];
}

export interface Graph {
  price: number;
  date:  string;
}

export interface ApiResponse {
  graph: Graph[];
  pair: string[]
}

const API_KEY = process.env.SERP_API_KEY
export const runtime = 'edge'
export async function POST (req: Request) {
  const body : BodyRequest = await req.json()
  let pair: string[] = []
  pair.push(body.coin)
  if (body.coin === 'USD') {
    pair.push('EUR')
  } else {
    pair.push('USD')
  }

  const response = await fetch(`https://serpapi.com/search.json?engine=google_finance&q=${pair[0]}-${pair[1]}&hl=en&api_key=${API_KEY}`, {
    method: 'GET',
    next: {revalidate: 28800}
  })
  if (!response.ok) {
    console.log(response)
    throw new Error('Error 006: POST on api/chart/route.ts')
  }
  const data : SerpApi = await response.json()
    
  return NextResponse.json({graph: data.graph, 'pair': pair})
}