import { chromium } from "playwright";
import { NextResponse } from "next/server";
interface formatPrice {
    coin: string;
    rate: string;
} 
type ObjectRate = {
    [key: string]: string
}
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
interface YadioApi {
    request:   RequestApi;
    result:    number;
    rate:      number;
    timestamp: number;
}
interface RequestApi {
    amount: number;
    from:   string;
    to:     string;
}

const BASE_URL = 'https://tasas.eltoque.com/v1/trmi'
const AUTH_TOKEN = process.env.API_ELTOQUE
export async function GET (req: Request) {
    const browser = await chromium.launch(
        { headless: true }
    )
    const page = await browser.newPage()
    await page.goto('https://www.mdiv.pro')
    const prices = await page.$$eval('.QuickStats_pricesrow__QWNo_', (result) => (
        result.map((el) => {
            const div = el.querySelectorAll('div > span')
            const text = Array.from(div).map((el) => {
                const ias = el as HTMLElement
                return ias?.innerText
            })
            return { text }
        })
    ))
    await browser.close()
    const mdiv: ObjectRate = {}
    const eltoque: ObjectRate = {}
    const yadio: ObjectRate = {}
    prices[0].text.forEach((el, index) => {
        if (index <= 2) {
            const { coin, rate } = formatPrice(el) as formatPrice
            if (coin && rate) {
                mdiv[`${coin}`] = rate
            }
        }
    })
    const tasasToque = await getToque()
    const tasasYadio = await getYadio()
    if (!tasasToque || !tasasYadio ) {
        return
    }
    eltoque.MLC = tasasToque.MLC.toString()
    eltoque.USD = tasasToque.USD.toString()
    eltoque.EUR = tasasToque.ECU.toString()
    yadio.MLC = tasasYadio.mlc.toString()
    yadio.USD = tasasYadio.usd.toString()
    yadio.EUR = tasasYadio.eur.toString()

    return NextResponse.json([
        {name: "MdivPro", "data": mdiv}, 
        {name: "El Toque", "data": eltoque}, 
        {name: "Yadio", "data": yadio}
    ])
}
async function getToque () {
    const getFormatDate = (offset = 0) => {
        const actualDate = new Date()
        actualDate.setDate(actualDate.getDate()-offset)
        const year = actualDate.getFullYear()
        const month = (actualDate.getMonth() + 1).toString().padStart(2, '0')
        const day = actualDate.getDate().toString().padStart(2, '0')
        const formatDate = `${year}-${month}-${day}`
    
        return formatDate
    }
    const date = getFormatDate(0)
    const response = await fetch(`${BASE_URL}?date_from=${date}%2000%3A00%3A01&date_to=${date}%2023%3A59%3A01`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        next: { revalidate: 86400 }
      })
      if (!response.ok) {
        return
      }
      const data : ApiElToque = await response.json()
      return data.tasas
}

async function getYadio() {
    const fetchData = async (coin: string) => {
        const response = await fetch(`https://api.yadio.io/convert/1/${coin}/CUP`, {
            method: "GET"
        })
        if (!response.ok) {
            return
        }
        const data: YadioApi = await response.json()
        return data.rate
    }
    const mlc = await fetchData('mlc')
    const usd = await fetchData('usd')
    const eur = await fetchData('eur')
    if (!mlc || !usd || !eur) {
        return 
    }
    return { mlc, usd, eur }
}

function formatPrice(text: string) : formatPrice | null {
    const coin = text.split(' ')[1]
    const rate = text.split(' ')[3].split('+')[0]
    if (coin && rate) {
        return { coin, rate }
    }
    return null
}
