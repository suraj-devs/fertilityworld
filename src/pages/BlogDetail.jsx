import { articles } from '../data/content'

function BlogDetail({ slug, onNavigate }) {
  const article = articles.find((item) => item.slug === slug) || articles[0]

  return (
    <article className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <img src={article.image} alt={article.title} className="img-fluid rounded-4 mb-4 w-100" />
          <p className="srv-subtitle mb-3">Fertility World guide</p>
          <h1 className="display-5 fw-semibold mb-4">{article.title}</h1>
          <p className="lead">{article.excerpt}</p>
          <p>Every fertility journey is different. A specialist assessment can help you understand your options, expected timelines and the care that may be right for you.</p>
          <p>Bring your questions to your consultation and ask about success factors, preparation, risks and follow-up. Clear information can make each next step feel more manageable.</p>
          <button type="button" className="callaction px-4 py-2 rounded-3 border-0 mt-3" onClick={() => onNavigate('contact')}>Talk to our care team</button>
        </div>
      </div>
    </article>
  )
}

export default BlogDetail