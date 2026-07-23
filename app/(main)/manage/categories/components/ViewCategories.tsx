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
                  <p>No subcategories found.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found.</p>
      )}
    </>
  );
}
