import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from './api.js'
import BlogCard from './BlogCard.jsx'

export default function BlogHighlights({ data = {} }) {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const count = [3, 4, 6].includes(Number(data.post_count)) ? Number(data.post_count) : 3

    api(`/blog?per_page=${count}`)
      .then((response) => {
        if (active) setPosts(response.posts.data)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })

    return () => { active = false }
  }, [data.post_count])

  if (!error && posts === null) return null

  return (
    <section className="section-space blog-highlights">
      <div className="site-width">
        <div className="section-top">
          <div>
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            <h2 className="section-title">{data.title || 'Latest from our blog'}</h2>
            {data.intro && <p className="section-copy mb-0">{data.intro}</p>}
          </div>
          <Link className="text-link" to="/blog">View all articles</Link>
        </div>
        {error
          ? <p className="blog-message" role="alert">Blog posts could not be loaded: {error}</p>
          : posts.length > 0
            ? <div className="blog-card-grid">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div>
            : <p className="blog-empty">New articles are coming soon. Visit our blog for helpful guidance and clinic news.</p>}
      </div>
    </section>
  )
}
