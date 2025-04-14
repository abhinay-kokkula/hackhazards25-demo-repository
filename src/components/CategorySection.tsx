
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Category {
  name: string;
  icon: string;
  description: string;
}

const categories: Category[] = [
  {
    name: "Handcrafted",
    icon: "🧶",
    description: "Unique artisan-made items"
  },
  {
    name: "Farm Fresh",
    icon: "🌾",
    description: "Organic produce & goods"
  },
  {
    name: "Traditional Art",
    icon: "🎨",
    description: "Cultural artifacts & art"
  },
  {
    name: "Home Goods",
    icon: "🏡",
    description: "Decor & household items"
  },
  {
    name: "Textiles",
    icon: "🧵",
    description: "Fabrics & woven products"
  },
  {
    name: "Local Foods",
    icon: "🍯",
    description: "Prepared foods & preserves"
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              to={`/browse/${category.name}`}
              key={category.name} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 flex flex-col items-center text-center group animate-gentle-appear"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-medium mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-primary text-sm">
                Explore <ArrowRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
