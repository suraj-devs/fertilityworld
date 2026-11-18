import { Link } from 'react-router-dom'

export default function AppLink({ href, ...props }) {
  const url = href || '/'
  const isInternal = url.startsWith('/') && !url.startsWith('//')

  return isInternal
    ? <Link to={url} {...props} />
    : <a href={url} {...props} />
}
