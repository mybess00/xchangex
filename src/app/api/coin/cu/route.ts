import { NextResponse } from "next/server";

type ApiElToque = RateResponse & {
  date: string;
  hour: number;
  minutes: number;
  seconds: number;
};

type RateResponse = {
  tasas: {
    USD: number;
    MLC: number;
    ECU: number;
    USDT_TRC20: number;
    BTC: number;
  };
}

type RateData = RateResponse & { date: string }

export type ApiResponse = {
  data: RateData
}

const BASE_URL = 'https://tasas.eltoque.com/v1/trmi'
const AUTH_TOKEN = process.env.API_ELTOQUE

export async function GET(req: Request) {
  const rateDays: RateData[] = []

  const getFormatDate = (offset = 0) => {
    const actualDate = new Date()
    actualDate.setDate(actualDate.getDate()-offset)
    const year = actualDate.getFullYear()
    const month = (actualDate.getMonth() + 1).toString().padStart(2, '0')
    const day = actualDate.getDate().toString().padStart(2, '0')
    const formatDate = `${year}-${month}-${day}`

    return formatDate
  }

  for (let i = 0; i < 5; i++) {
    const date = getFormatDate(i)
    const response = await fetch(`${BASE_URL}?date_from=${date}%2000%3A00%3A01&date_to=${date}%2023%3A59%3A01`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      next: { revalidate: 86400 }
    })
    if (!response.ok) {
      i = 6
      return
    }
    const data : ApiElToque = await response.json()
    const newData: RateData = {
      tasas: data.tasas,
      date: date,
    }
    rateDays.push(newData)
    setTimeout(() => {

    },60000)
  }
  return NextResponse.json({data: rateDays})
}