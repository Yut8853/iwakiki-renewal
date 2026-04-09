// components/Blog/BlogList.tsx
import BlogCard from './BlogCard';

export default function BlogList({ posts }: { posts: any[] }) {
  return (
    <div className="blog-grid">
      {posts.map((post, index) => (
        <div className="grid-item" data-category={post.data.category}>
          <BlogCard post={{ ...post.data, slug: post.slug }} index={index} />
        </div>
      ))}
    </div>
  );
}
