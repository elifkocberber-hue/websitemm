import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  title?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ products, title }) => {
  return (
    <section className="py-12">
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
