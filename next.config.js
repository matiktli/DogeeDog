/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'dogeedog.s3.eu-west-2.amazonaws.com',
      `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      'lh3.googleusercontent.com'
    ]
  },
  // Only enable React strict mode in development
  reactStrictMode: process.env.NODE_ENV === 'development',
}

module.exports = nextConfig 