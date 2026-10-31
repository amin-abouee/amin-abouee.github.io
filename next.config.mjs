import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  // static export uses trailing slash so GitHub Pages serves /path/ as /path/index.html
  trailingSlash: true,
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
