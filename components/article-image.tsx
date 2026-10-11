import { useState, type ComponentProps } from 'react'
import { useRouter } from 'next/router'

// A linked remote thumbnail must not leave a broken-image placeholder in prose.
export default function ArticleImage({ alt, onError, ...props }: ComponentProps<'img'>) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const pt = useRouter().locale === 'pt-br'
  if (failedSource === props.src) {
    return <span className="article-image-fallback">{alt || (pt ? 'Ver mídia vinculada' : 'View linked media')} →</span>
  }
  return <img {...props} alt={alt ?? ''} onError={event => { setFailedSource(String(props.src)); onError?.(event) }}/>
}
