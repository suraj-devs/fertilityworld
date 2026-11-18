import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from './api.js'
import BlogCard from './BlogCard.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import { SiteFooter, SiteHeader } from './SiteShell.jsx'
import { mediaUrl } from './mediaUrl.js'

function BlogChrome({ children }) {
  const [chrome, setChrome] = useState({ header: [], footer: [], settings: {}, error: '' })

  useEffect(() => {
    let active = true
    Promise.all([
      api('/menu?location=header'),
      api('/menu?location=footer'),
      api('/settings'),
    ])
      .then(([header, footer, settings]) => {
        if (active) setChrome({ header: header.items, footer: footer.items, settings: settings.settings ?? {}, error: '' })
      })
      .catch((error) => {
        if (active) setChrome((current) => ({ ...current, error: error.message }))
      })

    return () => { active = false }
  }, [])

  return (
    <>
      <SiteHeader items={chrome.header} settings={chrome.settings} />
      {chrome.error && <p className="blog-message" role="alert">Site navigation could not be loaded: {chrome.error}</p>}
      {children}
      <SiteFooter items={chrome.footer} settings={chrome.settings} />
    </>
  )
}

function BlogListing() {
  const [filters, setFilters] = useState({ search: '', category: '' })
  const [query, setQuery] = useState({ search: '', category: '', page: 1 })
  const [result, setResult] = useState({ key: '', posts: null, categories: [], error: '' })
  const queryKey = JSON.stringify(query)

  useEffect(() => {
    const currentQuery = JSON.parse(queryKey)
    const params = new URLSearchParams({ per_page: '9', page: String(currentQuery.page) })
    if (currentQuery.search) params.set('search', currentQuery.search)
    if (currentQuery.category) params.set('category', currentQuery.category)
    const controller = new AbortController()

    api(`/blog?${params}`, { signal: controller.signal })
      .then((response) => {
        setResult({ key: queryKey, posts: response.posts, categories: response.categories, error: '' })
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setResult({ key: queryKey, posts: null, categories: [], error: requestError.message })
        }
      })

    return () => controller.abort()
  }, [queryKey])

  const loading = result.key !== queryKey
  const posts = loading ? null : result.posts
  const error = loading ? '' : result.error
  const availableCategories = result.categories
  useEffect(() => {
    document.title = 'Fertility Care Blog | Nius We Care'
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', 'Clear answers, caring advice and helpful updates from our fertility care team.')
  }, [])

  function search(event) {
    event.preventDefault()
    setQuery({ ...filters, page: 1 })
  }

  return (
    <main className="blog-page">
      <section className="blog-intro">
        <div className="site-width">
          <p className="eyebrow">Nius We Care Journal</p>
          <h1 className="display-title">Guidance for your fertility journey</h1>
          <p className="section-copy">Clear answers, caring advice and helpful updates from our fertility care team.</p>
          <form className="blog-filters" onSubmit={search}>
            <label>
              <span className="sr-only">Search articles</span>
              <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search articles" />
            </label>
            <label>
              <span className="sr-only">Filter by category</span>
              <select value={filters.category} onChange={(event) => {
                const category = event.target.value
                setFilters({ ...filters, category })
                setQuery((current) => ({ ...current, category, page: 1 }))
              }}>
                <option value="">All categories</option>
                {availableCategories.map((category) => <option value={category} key={category}>{category}</option>)}
              </select>
            </label>
            <button className="button button-primary" type="submit">Search</button>
          </form>
        </div>
      </section>
      <section className="section-space">
        <div className="site-width">
          {error && <p className="blog-message" role="alert">Articles could not be loaded: {error}</p>}
          {loading && <LoadingScreen compact message="Finding helpful articles" />}
          {!loading && !error && posts?.data.length === 0 && <p>No articles match your search yet.</p>}
          {!loading && !error && posts?.data.length > 0 && (
            <>
              <div className="blog-card-grid">{posts.data.map((post) => <BlogCard key={post.id} post={post} />)}</div>
              <div className="blog-pagination">
                <button className="button button-outline" type="button" disabled={posts.current_page <= 1} onClick={() => setQuery({ ...query, page: query.page - 1 })}>Previous</button>
                <span>Page {posts.current_page} of {posts.last_page}</span>
                <button className="button button-outline" type="button" disabled={posts.current_page >= posts.last_page} onClick={() => setQuery({ ...query, page: query.page + 1 })}>Next</button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function PostContent({ blocks = [] }) {
  return blocks.map((block, index) => {
    if (block.type === 'heading') return <h2 key={index}>{block.text}</h2>
    if (block.type === 'quote') return <blockquote key={index}>{block.text}</blockquote>
    if (block.type === 'list') {
      return <ul key={index}>{(block.items ?? []).filter(Boolean).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
    }
    if (block.type === 'image') {
      const imageUrl = mediaUrl(block.url)
      if (!imageUrl) return null
      return (
        <figure key={index} className="blog-content-image">
          <img src={imageUrl} alt={block.alt || ''} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    }
    if (block.type === 'faq') {
      const faqs = Array.isArray(block.faqs)
        ? block.faqs.filter((faq) => faq.question?.trim() && faq.answer?.trim())
        : []
      if (!faqs.length) return null

      return (
        <section className="blog-inline-faq" key={index}>
          <h2>{block.title || 'Frequently asked questions'}</h2>
          <div className="blog-inline-faq-list">
            {faqs.map((faq, faqIndex) => (
              <details key={`${faq.question}-${faqIndex}`} name={`blog-faq-${index}`}>
                <summary>
                  <span>{faq.question}</span>
                  <span className="blog-inline-faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )
    }
    return <p key={index}>{block.text}</p>
  })
}

function BlogArticle({ slug }) {
  const [result, setResult] = useState({ slug: '', post: null, recentPosts: [], error: '' })

  useEffect(() => {
    const controller = new AbortController()
    api(`/blog/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then((response) => setResult({ slug, post: response.post, recentPosts: response.recent_posts ?? [], error: '' }))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setResult({ slug, post: null, recentPosts: [], error: requestError.message })
      })

    return () => controller.abort()
  }, [slug])

  const loading = result.slug !== slug
  const post = loading ? null : result.post
  const recentPosts = loading ? [] : result.recentPosts
  const error = loading ? '' : result.error
  const coverImage = mediaUrl(post?.cover_image)

  useEffect(() => {
    if (!post) return
    document.title = post.seo_title || post.title
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.setAttribute('content', post.seo_description || post.excerpt || 'Read helpful guidance from the Nius We Care fertility care team.')
    }
  }, [post])

  if (loading) return <main><LoadingScreen compact message="Opening this article" /></main>
  if (error || !post) {
    return (
      <main className="page-status page-error" role="alert">
        <h1>Article unavailable</h1>
        <p>{error || 'This article could not be found.'}</p>
        <Link className="button button-primary" to="/blog">Back to blog</Link>
      </main>
    )
  }

  return (
    <main className="blog-page">
      <div className="site-width blog-article-layout">
        <article className="blog-article">
          <Link className="text-link" to="/blog">← All articles</Link>
          <header className="blog-article-header">
            {post.category && <p className="eyebrow">{post.category}</p>}
            <h1 className="display-title">{post.title}</h1>
            {post.excerpt && <p className="section-copy">{post.excerpt}</p>}
            <p className="blog-byline">
              By {post.author}
              {post.published_at && <> · <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time></>}
            </p>
          </header>
          {coverImage
            ? <img className="blog-article-cover" src={coverImage} alt={post.cover_image_alt || post.title} />
            : <div className="blog-article-cover-fallback" role="img" aria-label={`${post.category || 'Nius We Care'} article cover`}><span>{post.category || 'Nius We Care'}</span><strong>{post.title}</strong></div>}
          <div className="blog-article-content"><PostContent blocks={post.content} /></div>
        </article>
        <aside className="blog-recent-posts" aria-label="Recent blog posts">
          <h2>Recent articles</h2>
          {recentPosts.length > 0
            ? <ul>{recentPosts.map((recentPost) => (
              <li key={recentPost.id}>
                <Link className={`blog-recent-post-link${mediaUrl(recentPost.cover_image) ? ' has-image' : ''}`} to={`/blog/${recentPost.slug}`}>
                  {mediaUrl(recentPost.cover_image) && <img src={mediaUrl(recentPost.cover_image)} alt={recentPost.cover_image_alt || ''} loading="lazy" />}
                  <span>{recentPost.title}</span>
                </Link>
              </li>
            ))}</ul>
            : <Link className="text-link" to="/blog">Explore all articles</Link>}
        </aside>
      </div>
    </main>
  )
}

export default function BlogPages() {
  const location = useLocation()
  const slug = location.pathname.replace(/^\/blog\/?/, '').replace(/\/+$/, '')

  return (
    <BlogChrome>
      {slug ? <BlogArticle key={slug} slug={slug} /> : <BlogListing />}
    </BlogChrome>
  )
}

export { PostContent }
