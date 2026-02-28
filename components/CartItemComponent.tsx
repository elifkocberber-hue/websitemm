'use client';

import Image from 'next/image';
import { CartItem } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface CartItemComponentProps {
  item: CartItem;
}

export const CartItemComponent: React.FC<CartItemComponentProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 mb-2">₺{item.price}</p>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            −
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
            className="w-12 text-center border border-gray-300 rounded py-1"
          />
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            +
          </button>
          <span className="ml-auto font-semibold text-gray-800">
            ₺{(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-600 hover:text-red-800 font-medium"
      >
        Sil
      </button>
    </div>
  );
};
