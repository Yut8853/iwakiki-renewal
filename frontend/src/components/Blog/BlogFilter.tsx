// components/Blog/BlogFilter.tsx
export default function BlogFilter({ categories }: any) {
  return (
    <div className="filter-bar">
      <button className="filter-btn active" data-filter="all">
        すべての記事
      </button>

      {Object.entries(categories).map(([key, value]: any) => (
        <button className="filter-btn" data-filter={key}>
          {value.label}
        </button>
      ))}
    </div>
  );
}
