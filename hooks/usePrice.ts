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

  return { get, convert }
}