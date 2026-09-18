import { articles } from '../data/content'

function BlogList({ onNavigate }) {
  return (
    <section className="container py-5">
      <div className="text-center mb-5">
        <p className="srv-subtitle mb-3">Fertility insights</p>
        <h1 className="display-5 fw-semibold mb-3">Guidance for your fertility journey</h1>
        <p className="lead">Helpful, accessible information from the Fertility World care team.</p>
      </div>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {articles.map((article) => (
          <article className="col" key={article.slug}>
            <div className="card-box blog-card-box rounded-3 overflow-hidden h-100">
              <img src={article.image} alt={article.title} className="img-fluid w-100 img-blog-box" />
              <div className="p-4">
                <h2 className="h4">{article.title}</h2>
                <p>{article.excerpt}</p>
                <a href={`/blog/${article.slug}`} onClick={(event) => { event.preventDefault(); onNavigate(`blog-detail:${article.slug}`) }} className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex">Read article</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogList