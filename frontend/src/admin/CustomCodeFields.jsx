export default function CustomCodeFields({ values, onChange, global = false }) {
  const scope = global ? 'global' : 'page'

  return (
    <article className="admin-card section-editor-card custom-code-card">
      <div>
        <p className="eyebrow">{global ? 'Every public page' : 'This page only'}</p>
        <h2>{global ? 'Global custom code' : 'Page-specific custom code'}</h2>
        <p>
          Header code accepts tags such as meta, link, and JSON-LD schema.
          Footer code is added before the closing body tag. Custom scripts execute on the public site.
        </p>
      </div>
      <label>
        Header / head code
        <textarea
          className="code-input"
          value={values[global ? 'global_head_code' : 'custom_head_code'] ?? ''}
          onChange={(event) => onChange(global ? 'global_head_code' : 'custom_head_code', event.target.value)}
          maxLength={500000}
          rows="8"
          placeholder={'<script type="application/ld+json">{ ... }</script>'}
        />
      </label>
      <label>
        Footer / body code
        <textarea
          className="code-input"
          value={values[global ? 'global_footer_code' : 'custom_footer_code'] ?? ''}
          onChange={(event) => onChange(global ? 'global_footer_code' : 'custom_footer_code', event.target.value)}
          maxLength={500000}
          rows="8"
          placeholder="<script>/* Your script */</script>"
        />
      </label>
      <label>
        Custom CSS
        <textarea
          className="code-input"
          value={values[global ? 'global_custom_css' : 'custom_css'] ?? ''}
          onChange={(event) => onChange(global ? 'global_custom_css' : 'custom_css', event.target.value)}
          maxLength={500000}
          rows="8"
          placeholder="/* Custom styles */"
        />
      </label>
      <p className="admin-field-help">
        {global
          ? 'Global code is combined with any page-specific code. Leave fields blank to add nothing.'
          : `Page code is combined with global code. This page's code only loads for visitors when the page is published.`}
      </p>
      <span className="sr-only">{scope} custom code editor</span>
    </article>
  )
}
