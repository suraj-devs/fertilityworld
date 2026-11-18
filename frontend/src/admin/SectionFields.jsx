import { parseSectionData } from '../sectionBlocks.js'
import { Link } from 'react-router-dom'
import ImageUploadField from './ImageUploadField.jsx'

function TextField({ label, value, onChange, multiline = false, ...props }) {
  const Field = multiline ? 'textarea' : 'input'

  return (
    <label>
      {label}
      <Field value={value ?? ''} onChange={(event) => onChange(event.target.value)} {...props} />
    </label>
  )
}

function ListFields({ items, fields, onChange, onAdd }) {
  return (
    <div className="block-list-editor">
      {items.map((item, index) => (
        <article className="block-list-item" key={index}>
          <div className="admin-heading-row">
            <strong>Item {index + 1}</strong>
            <button type="button" className="text-button danger-text" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
          </div>
          {fields.map((field) => field.type === 'image'
            ? (
              <ImageUploadField
                key={field.key}
                label={field.label}
                value={item[field.key]}
                onChange={(value) => onChange(items.map((current, itemIndex) => (
                  itemIndex === index ? { ...current, [field.key]: value } : current
                )))}
              />
            )
            : (
              <TextField
                key={field.key}
                label={field.label}
                value={item[field.key]}
                onChange={(value) => onChange(items.map((current, itemIndex) => (
                  itemIndex === index ? { ...current, [field.key]: value } : current
                )))}
                multiline={field.multiline}
                rows={field.multiline ? 3 : undefined}
                maxLength={field.maxLength ?? 1000}
              />
            ))}
        </article>
      ))}
      <button type="button" className="button button-outline" onClick={onAdd}>Add item</button>
    </div>
  )
}

export default function SectionFields({ section, onChange, onChangeField, faqCollections = [] }) {
  const data = parseSectionData(section.content)

  function update(field, value) {
    onChange(JSON.stringify({ ...data, [field]: value }, null, 2))
  }

  if (section.type === 'hero') {
    return (
      <div className="admin-field-grid">
        <label>
          Hero layout
          <select value={data.layout ?? 'split'} onChange={(event) => update('layout', event.target.value)}>
            <option value="split">Image beside text</option>
            <option value="cover">Full-width image banner</option>
          </select>
        </label>
        <TextField label="Small intro" value={data.eyebrow} onChange={(value) => update('eyebrow', value)} maxLength={180} />
        <TextField label="Main heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Highlighted heading (optional)" value={data.highlight} onChange={(value) => update('highlight', value)} maxLength={180} />
        <TextField label="Description" value={data.body} onChange={(value) => update('body', value)} multiline rows={4} maxLength={3000} />
        <ImageUploadField label="Hero image (optional)" value={data.image_url} onChange={(value) => update('image_url', value)} />
        <TextField label="Image description" value={data.image_alt} onChange={(value) => update('image_alt', value)} maxLength={255} />
        <TextField label="Primary button text" value={data.button_label} onChange={(value) => update('button_label', value)} maxLength={80} />
        <TextField label="Primary button link" value={data.button_url} onChange={(value) => update('button_url', value)} maxLength={2048} />
        <TextField label="Secondary button text (optional)" value={data.secondary_button_label} onChange={(value) => update('secondary_button_label', value)} maxLength={80} />
        <TextField label="Secondary button link" value={data.secondary_button_url} onChange={(value) => update('secondary_button_url', value)} maxLength={2048} />
      </div>
    )
  }

  if (section.type === 'service_pages') {
    return (
      <div className="admin-field-grid">
        <TextField label="Small intro" value={data.eyebrow} onChange={(value) => update('eyebrow', value)} maxLength={180} />
        <TextField label="Section heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Description" value={data.intro} onChange={(value) => update('intro', value)} multiline rows={3} maxLength={2000} />
        <TextField label="Button text (optional)" value={data.button_label} onChange={(value) => update('button_label', value)} maxLength={80} />
        <TextField label="Button link" value={data.button_url} onChange={(value) => update('button_url', value)} maxLength={2048} />
        <p className="admin-field-help">Published pages with a URL starting with services/ are listed automatically. Their hero image is used on each card.</p>
      </div>
    )
  }

  if (section.type === 'text') {
    return (
      <div className="admin-field-grid">
        <TextField label="Small intro (optional)" value={data.eyebrow} onChange={(value) => update('eyebrow', value)} maxLength={180} />
        <TextField label="Section heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Content" value={data.body} onChange={(value) => update('body', value)} multiline rows={6} maxLength={10000} />
      </div>
    )
  }

  if (section.type === 'image_text') {
    return (
      <div className="admin-field-grid">
        <TextField label="Small intro (optional)" value={data.eyebrow} onChange={(value) => update('eyebrow', value)} maxLength={180} />
        <TextField label="Section heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Content" value={data.body} onChange={(value) => update('body', value)} multiline rows={5} maxLength={10000} />
        <ImageUploadField label="Section image" value={data.image_url} onChange={(value) => update('image_url', value)} />
        <TextField label="Image description" value={data.image_alt} onChange={(value) => update('image_alt', value)} maxLength={255} />
        <label>
          Image position
          <select value={data.image_side ?? 'left'} onChange={(event) => update('image_side', event.target.value)}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>
        <TextField label="Button text (optional)" value={data.button_label} onChange={(value) => update('button_label', value)} maxLength={80} />
        <TextField label="Button link" value={data.button_url} onChange={(value) => update('button_url', value)} maxLength={2048} />
        <TextField label="Image caption heading (optional)" value={data.caption_title} onChange={(value) => update('caption_title', value)} maxLength={180} />
        <TextField label="Image caption text (optional)" value={data.caption_subtitle} onChange={(value) => update('caption_subtitle', value)} maxLength={255} />
        <TextField label="Feature list (one item per line)" value={Array.isArray(data.features) ? data.features.join('\n') : ''} onChange={(value) => update('features', value.split('\n').map((item) => item.trim()).filter(Boolean))} multiline rows={4} maxLength={2000} />
      </div>
    )
  }

  if (section.type === 'cards' || section.type === 'faq') {
    const isFaq = section.type === 'faq'
    const itemKey = isFaq ? 'items' : 'items'
    const items = Array.isArray(data[itemKey]) ? data[itemKey] : []

    return (
      <div className="section-block-fields">
        <div className="admin-field-grid">
          <TextField label="Section heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
          <TextField label="Intro (optional)" value={data.intro} onChange={(value) => update('intro', value)} multiline rows={3} maxLength={2000} />
        </div>
        <ListFields
          items={items}
          fields={isFaq
            ? [{ key: 'question', label: 'Question', maxLength: 255 }, { key: 'answer', label: 'Answer', multiline: true, maxLength: 3000 }]
            : [
              { key: 'title', label: 'Card heading', maxLength: 180 },
              { key: 'body', label: 'Card description', multiline: true, maxLength: 2000 },
              { key: 'image_url', label: 'Card image (optional)', type: 'image' },
              { key: 'image_alt', label: 'Image description', maxLength: 255 },
            ]}
          onChange={(value) => update(itemKey, value)}
          onAdd={() => update(itemKey, [...items, isFaq ? { question: '', answer: '' } : { title: '', body: '' }])}
        />
      </div>
    )
  }

  if (section.type === 'faq_collection') {
    const selectedCollection = faqCollections.find((collection) => collection.id === Number(section.faq_collection_id))

    return (
      <div className="admin-field-grid">
        <label>
          FAQ module
          <select
            required
            value={section.faq_collection_id ?? ''}
            onChange={(event) => onChangeField('faq_collection_id', event.target.value ? Number(event.target.value) : null)}
          >
            <option value="">Choose an FAQ module</option>
            {faqCollections.map((collection) => (
              <option value={collection.id} key={collection.id}>
                {collection.title}{collection.is_published ? '' : ' (draft)'}
              </option>
            ))}
          </select>
        </label>
        <p className="admin-field-help">
          Reuse and edit this FAQ module from the <Link to="/admin/faqs">FAQ library</Link>. Changes appear everywhere it is used.
        </p>
        {selectedCollection && !selectedCollection.is_published && (
          <p className="admin-field-help">This module is a draft and will not appear on the public page until it is published.</p>
        )}
        {faqCollections.length === 0 && (
          <p className="admin-field-help">Create an FAQ module in the FAQ library before adding it to this page.</p>
        )}
      </div>
    )
  }

  if (section.type === 'contact_profile') {
    return (
      <div className="admin-field-grid">
        <TextField label="Section heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Intro" value={data.intro} onChange={(value) => update('intro', value)} multiline rows={3} maxLength={2000} />
        <TextField label="Privacy or safety note" value={data.privacy_note} onChange={(value) => update('privacy_note', value)} multiline rows={3} maxLength={2000} />
      </div>
    )
  }

  if (section.type === 'cta') {
    return (
      <div className="admin-field-grid">
        <TextField label="Heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Description" value={data.body} onChange={(value) => update('body', value)} multiline rows={3} maxLength={2000} />
        <TextField label="Button text" value={data.button_label} onChange={(value) => update('button_label', value)} maxLength={80} required />
        <TextField label="Button link" value={data.button_url} onChange={(value) => update('button_url', value)} maxLength={2048} />
      </div>
    )
  }

  if (section.type === 'lead_form') {
    return (
      <div className="admin-field-grid">
        <TextField label="Small intro" value={data.eyebrow} onChange={(value) => update('eyebrow', value)} maxLength={180} />
        <TextField label="Form heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Intro" value={data.intro} onChange={(value) => update('intro', value)} multiline rows={3} maxLength={2000} />
        <TextField label="Submit button text" value={data.submit_label} onChange={(value) => update('submit_label', value)} maxLength={80} required />
      </div>
    )
  }

  if (section.type === 'blog_posts') {
    return (
      <div className="admin-field-grid">
        <TextField label="Small intro" value={data.eyebrow} onChange={(value) => update('eyebrow', value)} maxLength={180} />
        <TextField label="Section heading" value={data.title} onChange={(value) => update('title', value)} maxLength={180} required />
        <TextField label="Description" value={data.intro} onChange={(value) => update('intro', value)} multiline rows={3} maxLength={2000} />
        <label>
          Number of latest posts
          <select value={data.post_count ?? 3} onChange={(event) => update('post_count', Number(event.target.value))}>
            {[3, 4, 6].map((count) => <option value={count} key={count}>{count} posts</option>)}
          </select>
        </label>
      </div>
    )
  }

  return null
}
