import { useEffect } from 'react'

function appendMarkup(target, markup) {
  if (!markup) return () => {}

  const template = document.createElement('template')
  template.innerHTML = markup

  template.content.querySelectorAll('script').forEach((original) => {
    const script = document.createElement('script')
    Array.from(original.attributes).forEach(({ name, value }) => script.setAttribute(name, value))
    script.textContent = original.textContent
    original.replaceWith(script)
  })

  const nodes = Array.from(template.content.childNodes)
  target.append(template.content)

  return () => nodes.forEach((node) => node.remove())
}

function CustomCode({ headCode, footerCode, css }) {
  useEffect(() => {
    const removeHead = appendMarkup(document.head, headCode)
    const style = css ? document.createElement('style') : null
    if (style) {
      style.textContent = css
      document.head.append(style)
    }
    const removeFooter = appendMarkup(document.body, footerCode)

    return () => {
      removeHead()
      removeFooter()
      style?.remove()
    }
  }, [headCode, footerCode, css])

  return null
}

export function GlobalCustomCode({ settings = {} }) {
  return (
    <CustomCode
      headCode={settings.global_head_code}
      footerCode={settings.global_footer_code}
      css={settings.global_custom_css}
    />
  )
}

export function PageCustomCode({ page }) {
  return (
    <CustomCode
      headCode={page.custom_head_code}
      footerCode={page.custom_footer_code}
      css={page.custom_css}
    />
  )
}
