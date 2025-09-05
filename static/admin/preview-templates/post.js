import CMS from "netlify-cms-app"

const PostPreview = ({ entry, widgetFor }) => {
  return (
    <div className="preview-wrapper">
      <div className="preview-sidebar">
        <a href="/">Home</a>
        <a href="/blog/">Blog</a>
        <a href="/booknotes/">Booknotes</a>
        <a href="/projects/">Projects</a>
        <a href="/digital/">Digital</a>
        <a href="/podcast/">Podcast</a>
        <a href="/quotes/">Quotes</a>
        <a href="/lenscape/">Lenscape</a>
        <a href="/bio/">Bio</a>
        <a href="https://linkedin.com">LinkedIn</a>
        <a href="https://twitter.com">Twitter</a>
      </div>
      <div className="preview-content">
        <h1>{ entry.getIn(["data", "title"]) }</h1>
        { widgetFor("body") }
      </div>
    </div>
  )
}

CMS.registerPreviewTemplate("blog", PostPreview)
CMS.registerPreviewTemplate("booknotes", PostPreview)
