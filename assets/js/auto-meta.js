// Auto-generate meta tags for all blog posts
document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('h1')?.textContent || document.title;
    const url = window.location.href;
    
    // Create meta tags if they don't exist
    const metaTags = [
        {property: 'og:title', content: title},
        {property: 'og:type', content: 'article'},
        {property: 'og:url', content: url},
        {property: 'og:site_name', content: 'moileon.com'},
        {property: 'og:description', content: ''},
        {name: 'twitter:card', content: 'summary'},
        {name: 'twitter:title', content: title},
        {name: 'twitter:description', content: ''},
        {name: 'description', content: ''}
    ];
    
    metaTags.forEach(tag => {
        const attr = tag.property ? 'property' : 'name';
        const value = tag.property || tag.name;
        
        let meta = document.querySelector(`meta[${attr}="${value}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attr, value);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.content);
    });
    
    document.title = title + ' | moileon';
});
