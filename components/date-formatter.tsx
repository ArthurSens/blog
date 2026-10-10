import { parseISO, format } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { useLanguage } from '../lib/use-language'

type Props = { dateString: string }

const DateFormatter = ({ dateString }: Props) => {
  const { locale } = useLanguage()
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date,
    locale === 'pt-br' ? "d 'de' MMMM 'de' yyyy" : 'LLLL d, yyyy',
    { locale: locale === 'pt-br' ? ptBR : enUS },
  )}</time>
}

export default DateFormatter
