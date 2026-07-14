type Category = {
  category_id: number;
  name: string;
  subcategories: {
    name: string;
    subcategory_id: number;
  }[];
};

export default function ViewCategories({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <>
      {categories.length > 0 ? (
        <ul className="gap-container mb-0">
          {categories.map((cat) => (
            <li key={cat.category_id}>
              <div className="gap-container">
                {cat.name}
                {cat.subcategories.length > 0 ? (
                  <ul className="gap-container">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.subcategory_id}>{sub.name}</li>
                    ))}
                  </ul>
                ) : (
                  <div>No subcategories found.</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No categories found.</div>
      )}
    </>
  );
}
