import { useLanguage } from '../lib/use-language'
import Container from './container'
import cn from 'classnames'

type Props = {
  preview?: boolean
}

const Alert = ({ preview }: Props) => {
  const { t } = useLanguage()
  return (
    <div
      className={cn('border-b', {
        'bg-neutral-800 border-neutral-800 text-white': preview,
        'bg-neutral-50 border-neutral-200': !preview,
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm">
          {preview ? (
            <>
              {t.preview}{' '}
              <a
                href="/api/exit-preview"
                className="underline hover:text-teal-300 duration-200 transition-colors"
              >
                {t.exitPreview}
              </a>
            </>
          ) : (
            <>
              {t.sourceIntro}
              <a
                href={`https://github.com/ArthurSens/blog`}
                className="underline hover:text-blue-600 duration-200 transition-colors"
              >
                {t.sourceLink}
              </a>
              .
            </>
          )}
        </div>
      </Container>
    </div>
  )
}

export default Alert
