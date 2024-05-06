import { request } from "http";

interface ElementApi {
  date: string;
  tasas: {
    USD: number;
    MLC: number;
    ECU: number;
    USDT_TRC20: number;
    BTC: number;
  };
}

interface DataElToque {
  data: ElementApi[]
}

interface ConvertReturn {
  data: {
    rate: number, 
    request: {
      amount: string,
      from: string,
      to: string,
    },
    result: number
  }
}

export function usePrice () {

  const get = async (coin: string) => {
    const response = await fetch('api/coin', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({
        currency: coin
      })
    })
    if (!response.ok) {
      console.log(response)
      throw new Error('Error 004: POST on hooks/usePrice.ts')
    }
    const data = await response.json()
    return data.data
  }

  const convert = async (amount: string, from: string, to: string) => {
    const initialAmount = amount
    if (from === "CUP" || from === "MLC") {
      const responseCu = await fetch('api/coin/cu', {
        method: 'GET',
      })
      if (!responseCu.ok) {
        console.log(responseCu)
        throw new Error('Error 007: POST on hooks/usePrice.ts - CU coins')
      }
      const dataCu : DataElToque = await responseCu.json()
      if (from === "MLC") {
        const newAmount = parseFloat(amount) * dataCu.data[0].tasas.MLC
        amount = newAmount.toString()
      }
      if (to === "MLC" || to === "USD" || to === "EUR") {
        to === "EUR" ? to = 'ECU' : to
        const rate = 1 / dataCu.data[0].tasas[to as "USD" || "MLC" || "ECU"]
        const result = parseFloat(amount) * rate
        return {
          "rate": from === "MLC" ? result / parseFloat(initialAmount) : rate, 
          "request": {
          amount,
          from,
          to,
          },
          result
        }
      } else {
        const amountUsd = parseFloat(amount) / dataCu.data[0].tasas.USD
        const response = await fetch('api/convert', {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json'},
          body: JSON.stringify({
            "amount": amountUsd.toString(),
            from: "USD",
            to
          })
        })
        if (!response.ok) {
          console.log(response)
          throw new Error('Error 005: POST on hooks/usePrice.ts')
        }
        const data: ConvertReturn = await response.json()
        const rate = data.data.result / parseFloat(amount)
        return {
          "rate": from === "MLC" ? data.data.result / parseFloat(initialAmount) : rate,
          "request": {
            amount,
            from,
            to,
          },
          "result": data.data.result
        }
      }
    } else if (to === "CUP" || to === "MLC") {
      const responseCu = await fetch('api/coin/cu', {
        method: 'GET',
      })
      if (!responseCu.ok) {
        console.log(responseCu)
        throw new Error('Error 007: POST on hooks/usePrice.ts - CU coins')
      }
      const dataCu : DataElToque = await responseCu.json()
      if (from === "MLC" || from === "USD" || from === "EUR") {
        from === "EUR" ? from = 'ECU' : from
        const rate = to === "MLC" ? dataCu.data[0].tasas[from as "ECU" | "MLC" | "USD"] / dataCu.data[0].tasas.MLC : dataCu.data[0].tasas[from as "ECU" | "MLC" | "USD"]
        const result = parseFloat(amount) * rate
        return {
          "rate": from === "MLC" ? result / parseFloat(initialAmount) : rate, 
          "request": {
          amount,
          from,
          to,
          },
          result
        }
      } else {
        const response = await fetch('api/convert', {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json'},
          body: JSON.stringify({
            amount,
            from,
            to: "USD",
          })
        })
        if (!response.ok) {
          console.log(response)
          throw new Error('Error 005: POST on hooks/usePrice.ts')
        }
        const data: ConvertReturn = await response.json()
        const result = to === "MLC" ? data.data.result * (dataCu.data[0].tasas.USD / dataCu.data[0].tasas.MLC) : data.data.result * dataCu.data[0].tasas.USD
        const rate = result / parseFloat(amount)
        return {
          rate,
          "request": {
            amount,
            from,
            to,
          },
          result
        }
      }
    } else {
      const response = await fetch('api/convert', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
          amount,
          from,
          to
        })
      })
      if (!response.ok) {
        console.log(response)
        throw new Error('Error 005: POST on hooks/usePrice.ts')
      }
      const data = await response.json()
      return data.data
    }
  }
  
  const market = async () => {
    const response = await fetch('api/market', {
      method: "GET",
      next: {revalidate: 28800}
    })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data
  }

  return { get, convert, market }
}