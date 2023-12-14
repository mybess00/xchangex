'use client'

import '../../styles/SelectCurrency.css'
import { useState } from 'react'

type SelectCurrency = {
  title?: string
  aRef: MutableRefObject<null>
  eventChange?: any
}

export const CURRENCIES = {
  USD: 'USD: United State Dollar',
  CUP: 'CUP: Cuban Peso',
  MLC: 'MLC: Moneda Librevemente Convertible',
  EUR: 'EUR: Euro',
  UYU: 'UYU: Peso uruguayo',
  BRL: 'BRL: Real brasileño',
  MXN: 'MXN: Peso mexicano',
  BTC: 'BTC: Bitcoin',
  ETH: 'ETH: Ethereum',
  USDT: 'USDT: Tether',
}

const fetchCurrency = async () => {
  const response = await fetch('/api/currency', { method: 'GET' })
  if (!response.ok) {
    throw new Error ('Error 101: fetchCurrency() on components/ui/SelectCurrency.tsx')
  }
  const data = await response.json()
}

export default function SelectCurrency ({ title, aRef = null, eventChange } : SelectCurrency) {
  
  const [selectedValue, setSelectedValue] = useState('placeholder')
  const handleCurrencySelect = () => {
    if (aRef.current) {
      const selectCurrencyElement : HTMLSelectElement = aRef.current
      setSelectedValue(selectCurrencyElement.value)
      if (eventChange) {
        eventChange()
      }
    }
  }
 
  return (
    <div className="ct-selectcurrency">
      {title ?? <p>{title}</p>}
      <select value={selectedValue} ref={aRef} onChange={handleCurrencySelect}>
        <option value='placeholder' disabled>Select a currency</option>
        {Object.entries(CURRENCIES).map(([key, value]) => {
          return  <option value={key} key={key}>{value}</option>
        })}
      </select>
    </div>
  )
}