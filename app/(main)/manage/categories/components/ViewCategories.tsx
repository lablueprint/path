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
    <ul>
      {categories?.map((cat) => (
        <li key={cat.category_id}>
          {cat.name}
          <ul>
            {cat.subcategories?.map((sub) => (
              <li key={sub.subcategory_id}>{sub.name}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
