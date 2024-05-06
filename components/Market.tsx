'use client'
import '../styles/Market.css'
import { usePrice } from '../hooks/usePrice'
import { useEffect, useState } from 'react'
interface MarketApi {
  name: string;
  data: Data;
}

interface Data {
  MLC: string;
  USD: string;
  EUR: string;
}

export default function Market() {
  const dataMarket = usePrice()
  const [data, setData] = useState<MarketApi[]>([])
  const showMarket = async () => {
    const response : MarketApi[] = await dataMarket.market()
    if (response) {
      setData(response)
    }
  }
  useEffect(() => {
    showMarket()
  }, [])
  return (
    <section className="ct-market">
      <div className="mk-title">
        <h2>Market Price</h2>
        <p>See the price of cubans currencies on differents markets.</p>
      </div>
      <div className="mk-flex">
        <div className="mk-margin">
          <div className="mk-padding">
            <div className="mk-overflow">
              <table className="mk-table">
                <thead>
                  <tr>
                    <th scope="col" className="mk-th-first">Site</th>
                    <th scope="col" className="mk-th-first">USD</th>
                    <th scope="col" className="mk-th-first">MLC</th>
                    <th scope="col" className="mk-th-first">EUR</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.map((el, index) => {
                      return (
                        <tr key={index}>
                          <td className="mk-th-c-first">{el.name}</td>
                          <td className="mk-th-c-first">{parseFloat(el.data.USD).toFixed(2)}</td>
                          <td className="mk-th-c-first">{parseFloat(el.data.MLC).toFixed(2)}</td>
                          <td className="mk-th-c-first">{parseFloat(el.data.EUR).toFixed(2)}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}