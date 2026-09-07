import { ShoppingCart } from "lucide-react";

type ProductCardProps = {
  title?: string;
  name: string;
  description?: string;
  price: number;
  onAdd: () => void;
  isOpen: boolean;
};

export function ProductCard({
  title,
  name,
  description,
  price,
  onAdd,
  isOpen,
}: ProductCardProps) {
  return (
    <div className="p-3 bg-white rounded-lg shadow text-sm">
      <h3 className="font-bold text-lg">
        {title && <span className="mr-2">{title}</span>}
        {name}
      </h3>

      {description && (
        <p className="text-gray-600">{description}</p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="font-semibold">
          R$ {price.toFixed(2).replace(".", ",")}
        </span>

        {isOpen && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold active:scale-95"
          >
            <ShoppingCart size={16} />
            Adicionar
          </button>
        )}
      </div>
    </div>
  );
}