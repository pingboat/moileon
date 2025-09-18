const config = {
  backend: {
    name: 'git-gateway',
    repo: 'pingboat/moileon',
    branch: 'dev',
  },
  publish_mode: 'editorial_workflow',
  media_folder: 'assets/images',
  public_folder: '/assets/images',
  site_url: 'https://moileon.in',
  editor: {
    preview: true,
    preview_styles: [
      '/css/main.css',
      '/admin/preview.css',
    ],
  },
  collections: [
    // Your entire collections object goes here.
    // Copy everything from the "collections:" line in your config.yml.
    // Make sure it's a valid JavaScript object format.
  ],
};

window.CMS_CONFIG = config;
