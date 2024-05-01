import styles from './page.module.css'
import Calculator from '../../components/Calculator'
import Chart from '../../components/Chart'
import CurrencyDetails from '../../components/CurrencyDetails'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.ctparent}>
        <Calculator/>
        <Chart/>
        <CurrencyDetails/>
      </div>
    </main>
  )
}
