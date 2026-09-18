import { articles } from '../data/content'

function SearchPage({ onNavigate }) {
  const query = new URLSearchParams(window.location.search).get('q')?.trim() || ''
  const results = query ? articles.filter((article) => `${article.title} ${article.excerpt}`.toLowerCase().includes(query.toLowerCase())) : articles

  return (
    <section className="container py-5">
      <h1 className="display-6 fw-semibold mb-4">Search fertility resources</h1>
      <form className="row g-2 mb-5" onSubmit={(event) => { event.preventDefault(); const value = event.currentTarget.elements.query.value.trim(); window.history.pushState({}, '', `/search?q=${encodeURIComponent(value)}`); onNavigate('search') }}>
        <div className="col-md-9"><label className="visually-hidden" htmlFor="search-query">Search</label><input id="search-query" name="query" defaultValue={query} className="form-control" placeholder="Search IVF, IUI, egg freezing..." /></div>
        <div className="col-md-3"><button className="callaction border-0 rounded-3 px-4 py-2 w-100" type="submit">Search</button></div>
      </form>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {results.map((article) => <article className="col" key={article.slug}><div className="card-box rounded-3 p-4 h-100"><h2 className="h4">{article.title}</h2><p>{article.excerpt}</p><a href={`/blog/${article.slug}`} onClick={(event) => { event.preventDefault(); onNavigate(`blog-detail:${article.slug}`) }}>Read article</a></div></article>)}
      </div>
      {!results.length ? <p>No resources found. Try another search term.</p> : null}
    </section>
  )
}

export default SearchPage