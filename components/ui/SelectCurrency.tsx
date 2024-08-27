'use client'

import '../../styles/SelectCurrency.css'
import { RefObject, useState } from 'react'

type SelectCurrency = {
  title?: string
  aRef: RefObject<HTMLSelectElement>
  eventChange?: any
  currencyPack? : Object
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
}

export const CHART_CURRENCIES = {
  USD: 'USD: United State Dollar',
  EUR: 'EUR: Euro',
  UYU: 'UYU: Peso uruguayo',
  BRL: 'BRL: Real brasileño',
  MXN: 'MXN: Peso mexicano',
  BTC: 'BTC: Bitcoin',
}

const fetchCurrency = async () => {
  const response = await fetch('/api/currency', { method: 'GET' })
  if (!response.ok) {
    throw new Error ('Error 101: fetchCurrency() on components/ui/SelectCurrency.tsx')
  }
  const data = await response.json()
}

export default function SelectCurrency ({ title, aRef, eventChange, currencyPack } : SelectCurrency) {
  
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
        {!currencyPack ? Object.entries(CURRENCIES).map(([key, value]) => {
          return  <option value={key} key={key}>{value}</option>
        }) : Object.entries(currencyPack).map(([key, value]) => {
          return  <option value={key} key={key}>{value}</option>
        })}
      </select>
    </div>
  )
}