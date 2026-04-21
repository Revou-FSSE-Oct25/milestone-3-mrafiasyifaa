"use client";

import React, { useState, useEffect } from "react";
import NoProduct from "./NoProduct";
import CategoryList from "./CategoryList";
import ProductCard from "./ProductCard";
import { Loader } from "lucide-react";
import { Product } from "@/src/types/product";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/products?limit=${LIMIT}&offset=${(page - 1) * LIMIT}`;

        if (selectedCategory !== "All") {
          url += `&categoryId=${getCategoryId(selectedCategory)}`;
        }

        const response = await fetch(url, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
          console.error("Products fetch experiencing Error!", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [selectedCategory, page]);

  const getCategoryId = (categoryName: string) => {
    const categoryMap: { [key: string]: number } = {
      Clothes: 1,
      Electronics: 2,
      Furniture: 3,
      Shoes: 4,
      Miscellaneous: 5,
    };
    return categoryMap[categoryName] || "";
  };

  const setSelectedTab = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  if (error) {
    return (
      <div>
        <CategoryList
          selectedCategory={selectedCategory}
          onTabSelect={setSelectedTab}
        />
        <div className="text-red-600 text-sm mt-4">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <CategoryList
        selectedCategory={selectedCategory}
        onTabSelect={setSelectedTab}
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 gap-4 bg-gray-200 w-full mt-10">
          <div className="space-x-2 flex items-center text-blue-600/50">
            <Loader className="w-5 h-6 animate-spin" />
          </div>
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <NoProduct selectedCategory={selectedCategory} />
      )}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-4 py-2 text-sm border rounded disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={products.length < LIMIT}
          className="px-4 py-2 text-sm border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
