const sectionTypes = [
  { value: 'html', label: 'Legacy HTML section' },
  { value: 'hero', label: 'Hero banner' },
  { value: 'service_pages', label: 'Dynamic service pages' },
  { value: 'text', label: 'Text section' },
  { value: 'image_text', label: 'Image and text' },
  { value: 'cards', label: 'Feature cards' },
  { value: 'faq', label: 'Inline FAQs (this page only)' },
  { value: 'faq_collection', label: 'Reusable FAQ module' },
  { value: 'cta', label: 'Call-to-action' },
  { value: 'contact_profile', label: 'Clinic contact details' },
  { value: 'lead_form', label: 'Contact form' },
  { value: 'blog_posts', label: 'Latest blog posts' },
]

const sectionDefaults = {
  hero: {
    heading: 'Hero banner',
    content: {
      eyebrow: 'Welcome',
      title: 'Your page title',
      highlight: '',
      body: 'Introduce this page and what visitors can find here.',
      image_url: '',
      image_alt: '',
      layout: 'split',
      button_label: '',
      button_url: '',
      secondary_button_label: '',
      secondary_button_url: '',
    },
  },
  text: {
    heading: 'Text section',
    content: {
      eyebrow: '',
      title: 'Section title',
      body: 'Write your section content here.',
    },
  },
  image_text: {
    heading: 'Image and text',
    content: {
      eyebrow: '',
      title: 'Section title',
      body: 'Add a description to accompany your image.',
      image_url: '',
      image_alt: '',
      image_side: 'left',
      button_label: '',
      button_url: '',
      caption_title: '',
      caption_subtitle: '',
      features: [],
    },
  },
  service_pages: {
    heading: 'Dynamic service pages',
    content: {
      eyebrow: 'Care designed around you',
      title: 'Different paths. One beautiful possibility.',
      intro: 'Explore our published treatment pages and find care for your journey.',
      button_label: 'Explore all treatments',
      button_url: '/treatments',
    },
  },
  cards: {
    heading: 'Feature cards',
    content: {
      title: 'Highlights',
      intro: '',
      items: [{ title: 'Feature title', body: 'Describe this feature.' }],
    },
  },
  faq: {
    heading: 'Frequently asked questions',
    content: {
      title: 'Frequently asked questions',
      intro: '',
      items: [{ question: 'Add a question', answer: 'Write the answer here.' }],
    },
  },
  faq_collection: {
    heading: 'Reusable FAQ module',
    content: {
      title: 'Frequently asked questions',
    },
  },
  cta: {
    heading: 'Call-to-action',
    content: {
      title: 'Ready to take the next step?',
      body: 'Add a short, helpful message.',
      button_label: 'Contact us',
      button_url: '/contact-us',
    },
  },
  contact_profile: {
    heading: 'Clinic contact details',
    content: {
      title: 'Visit our clinic',
      intro: 'Get in touch or plan your visit.',
    },
  },
  lead_form: {
    heading: 'Contact form',
    content: {
      eyebrow: 'We are here to help',
      title: 'Talk to our care team',
      intro: 'Send a request and our team will contact you.',
      submit_label: 'Send request',
    },
  },
  blog_posts: {
    heading: 'Latest from our blog',
    content: {
      eyebrow: 'Helpful advice and clinic news',
      title: 'Latest from our blog',
      intro: 'Explore clear, supportive guidance from our fertility care team.',
      post_count: 3,
    },
  },
}

export { sectionTypes }

export function createSection(type) {
  if (type === 'html') {
    return {
      heading: 'Legacy HTML section',
      type,
      content: '<section class="section-space"><div class="site-width"><h2 class="section-title">Section title</h2><p class="section-copy">Add your content here.</p></div></section>',
      is_visible: true,
    }
  }

  const template = sectionDefaults[type] ?? sectionDefaults.text
  return {
    heading: template.heading,
    type,
    content: JSON.stringify(template.content, null, 2),
    is_visible: true,
  }
}

export function parseSectionData(content) {
  try {
    const data = JSON.parse(content)
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}
