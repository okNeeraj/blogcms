const withImageLoader = require('next-image-loader')
const { PHASE_EXPORT } = require('next/constants')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const defaultOptions = withBundleAnalyzer({
  //...(process.env.NETLIFY === 'true' && { target: 'serverless' }),
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  images: {
    deviceSizes: [320, 500, 680, 1040, 2080, 2048, 3120],
    domains: [
      'localhost',
      'localhost:3001',
      '127.0.0.1',
      'images.unsplash.com',
      'static.gotsby.org',
      'static.ghost.org',
      'gatsby.ghost.io',
      'ghost.org',
      'repository-images.githubusercontent.com',
      'www.gravatar.com',
      'github.githubassets.com',
      ...(process.env.IMAGE_DOMAINS || '').split(','),
    ],
  },
  reactStrictMode: true,
})
// console.log(defaultOptions);
/**
 * The customImageLoaderOptions object is returned only when `next export` is used,
 * since `next export` requires a custom image loader(https://nextjs.org/docs/advanced-features/static-html-export)
 * which you can customize in image-loader.config.js
 */
const customImageLoaderOptions = withBundleAnalyzer(
  withImageLoader({
    ...(process.env.NETLIFY === 'true' && { target: 'serverless' }),
    // https://nextjs.org/docs/api-reference/next/image#loader
    images: {
      loader: 'custom',
    },
    reactStrictMode: true,
    experimental: { esmExternals: false },
  })
)

module.exports = (phase, { _defaultConfig }) => {
  const isExport = process.env.IS_EXPORT || phase === PHASE_EXPORT
  return isExport ? customImageLoaderOptions : defaultOptions
}