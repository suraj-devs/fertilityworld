import { Link } from 'react-router-dom'
import { mediaUrl } from './mediaUrl.js'

export default function BlogCard({ post }) {
  const coverImage = mediaUrl(post.cover_image)

  return (
    <article className="blog-card">
      <Link className="blog-card-image" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        {coverImage
          ? <img src={coverImage} alt={post.cover_image_alt || post.title} loading="lazy" />
          : <span aria-hidden="true"><small>Nius We Care Journal</small><strong>{post.category || 'Fertility care'}</strong></span>}
      </Link>
      <div className="blog-card-body">
        {post.category && <p className="eyebrow">{post.category}</p>}
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <Link className="text-link" to={`/blog/${post.slug}`}>Read article</Link>
      </div>
    </article>
  )
}
