"use client";

import React from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useStore from "@/store";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Title, SubTitle, SubText } from "@/components/ui/text";
import QuantityButtons from "@/components/QuantityButtons";
import EmptyCart from "@/components/EmptyCart";
import { toast } from "sonner";

const CartPage = () => {
  const { items, deleteCartProduct, getSubTotalPrice, resetCart } = useStore();

  const subtotal = getSubTotalPrice();
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleDeleteProduct = (productId: string, productTitle: string) => {
    deleteCartProduct(productId);
    toast.success("Removed from cart!", {
      description: productTitle,
    });
  };

  const handleClearCart = () => {
    resetCart();
    toast.success("Cart cleared successfully!");
  };

  if (!items || items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <Title className="text-2xl">Shopping Cart</Title>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-revoshop-navy/10">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row gap-4 p-4 border-b border-revoshop-navy/10 last:border-b-0"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.product.slug}/${item.product.id}`}
                  className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden group"
                >
                  {item.product.images && item.product.images[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className="object-contain group-hover:scale-105 hoverEffect"
                    />
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}/${item.product.id}`}
                      >
                        <SubTitle className="text-base hover:text-revoshop-accent hoverEffect line-clamp-2">
                          {item.product.title}
                        </SubTitle>
                      </Link>
                      {item.product.category && (
                        <SubText className="text-xs text-gray-500 mt-1">
                          {item.product.category.name}
                        </SubText>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteProduct(
                          item.product.id.toString(),
                          item.product.title
                        )
                      }
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <SubText className="text-xs font-medium">
                        Quantity:
                      </SubText>
                      <QuantityButtons product={item.product} />
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <SubText className="text-sm font-semibold text-revoshop-navy">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </SubText>
                      {item.quantity > 1 && (
                        <SubText className="text-xs text-gray-500">
                          (${item.product.price.toFixed(2)} each)
                        </SubText>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Button */}
          <Link href="/shop" className="block mt-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-revoshop-accent text-revoshop-accent hover:bg-revoshop-accent hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-96">
          <div className="bg-white rounded-lg shadow-sm border border-revoshop-navy/10 p-6 sticky top-24">
            <SubTitle className="text-xl mb-6">Order Summary</SubTitle>

            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <SubText>Subtotal ({items.length} items)</SubText>
                <SubText className="font-semibold">
                  ${subtotal.toFixed(2)}
                </SubText>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center">
                <SubText>Shipping</SubText>
                <SubText className="font-semibold">
                  {shipping > 0 ? `$${shipping.toFixed(2)}` : "FREE"}
                </SubText>
              </div>

              {/* Divider */}
              <div className="border-t border-revoshop-navy/10 pt-4">
                <div className="flex justify-between items-center">
                  <SubTitle className="text-lg">Total</SubTitle>
                  <SubTitle className="text-xl text-revoshop-accent">
                    ${total.toFixed(2)}
                  </SubTitle>
                </div>
              </div>

              {/* Checkout Button */}
              <Button className="w-full bg-revoshop-accent hover:bg-revoshop-accent-hover text-white mt-4">
                Proceed to Checkout
              </Button>

              {/* Info Text */}
              <SubText className="text-xs text-center text-gray-500 mt-3">
                Taxes and shipping calculated at checkout
              </SubText>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;