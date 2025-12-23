import { useState, useMemo, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdClear,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLocationOn,
  MdStar,
} from "react-icons/md";
import {
  useProductCategories,
  useProductCities,
  useProducts,
  useSearchProducts,
} from "../hooks/useProduct";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";

// TypeScript interfaces
interface City {
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export const ProductsPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | "">("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<
    "new" | "used" | ""
  >("");
  const [showFilters, setShowFilters] = useState(false);

  const [hasDataBeenFetched, setHasDataBeenFetched] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFirstInit, setIsFirstInit] = useState(true);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useProductCategories();
  const {
    data: citiesData,
    isLoading: citiesLoading,
    error: citiesError,
  } = useProductCities();

  const productSearchMutation = useSearchProducts();
  // Handle search
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // console.log('🔍 Searching for:', query);
      // Clear ALL filters when searching to show all search results
      if (
        selectedCategoryId ||
        priceOrder ||
        selectedCondition ||
        selectedLocations.length > 0
      ) {
        // console.log('🔍 Clearing all filters for search');
        setSelectedCategoryId("");
        setPriceOrder("");
        setSelectedCondition("");
        setSelectedLocations([]);
      }
      productSearchMutation.mutate(
        { filter: query.trim() },
        {
          onSuccess: (data) => {
            // console.log('✅ Search results:', data);
            if (data?.content?.result === null) {
              console.log("🔍 No products found for query:", query);
            }
          },
          onError: (error) => {
            console.error("❌ Search failed:", error);
          },
        }
      );
    }
  };

  // Process categories from API - now storing both ID and name
  const categories = useMemo((): Category[] => {
    const baseCategories: Category[] = [{ id: "", name: "Semua" }]; // Base category with empty ID

    if (categoriesData?.content?.result) {
      const apiCategories = categoriesData.content.result.map(
        (cat: any): Category => ({
          id: cat.id || cat.category_id || "",
          name:
            cat.name ||
            cat.category_name ||
            cat.title ||
            "Kategori Tidak Diketahui",
        })
      );
      return [...baseCategories, ...apiCategories];
    }

    return baseCategories;
  }, [categoriesData]);

  // Process cities from API
  const cities = useMemo((): City[] => {
    if (
      citiesData?.content?.result &&
      Array.isArray(citiesData.content.result)
    ) {
      return citiesData.content.result.map(
        (city: any): City => ({
          name: city.name || city.city_name || "Kota Tidak Diketahui",
        })
      );
    }
    return [];
  }, [citiesData]);
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({
    limit: 12,
    offset: offset,
    orderby: searchQuery.trim() ? "" : priceOrder ? "price" : "",
    order: searchQuery.trim() ? "asc" : priceOrder || "desc",
    category: searchQuery.trim() ? "" : selectedCategoryId, // Clear filters when searching
    location: searchQuery.trim() ? "" : selectedLocations.join(","), // Clear filters when searching
    condition: searchQuery.trim() ? "" : selectedCondition, // Clear filters when searching
  });

  // Process products from API
  const products = useMemo(() => {
    // If we have search results (including null results), use them
    if (productSearchMutation.data?.content) {
      // Handle case where search returns null results
      if (
        productSearchMutation.data.content.result === null ||
        !Array.isArray(productSearchMutation.data.content.result)
      ) {
        // console.log('🔍 Search returned no results (null/invalid)');
        return []; // Return empty array for no results
      }
      // console.log('🔍 Using search results:', productSearchMutation.data.content.result);
      return productSearchMutation.data.content.result;
    }

    // Use accumulated products for infinite scroll
    return allProducts;
  }, [allProducts, productSearchMutation.data]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // If we have search results from API, don't apply additional category filtering
    // because search should show all relevant products regardless of category filter
    if (productSearchMutation.data?.content && searchQuery.trim()) {
      return filtered; // Return search results as-is
    }

    // Only apply category filtering when NOT searching
    if (
      !searchQuery.trim() &&
      selectedCategoryId &&
      selectedCategoryId !== ""
    ) {
      filtered = filtered.filter(
        (product: any) =>
          (product.category_id || product.categoryId || "") ===
          selectedCategoryId
      );
    }

    // Apply local search filtering only when using main products API (not search API)
    if (searchQuery.trim() && !productSearchMutation.data?.content) {
      filtered = filtered.filter((product: any) =>
        (product.title || product.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategoryId, productSearchMutation.data]);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Call search for any non-empty query (removed length > 2 restriction)
      const debounceTimer = setTimeout(() => {
        handleSearch(searchQuery.trim());
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else if (searchQuery === "") {
      // Clear search results when search is cleared to return to original product list
      if (productSearchMutation.data) {
        productSearchMutation.reset();
      }
      // Don't refetch here to prevent infinite loop - just reset search state
    }
  }, [searchQuery]); // Removed productSearchMutation and refetchProducts from dependency array

  useEffect(() => {
    // Only process if not currently loading
    if (!productsLoading && productsData) {
      if (
        productsData?.content?.result &&
        Array.isArray(productsData.content.result)
      ) {
        const newProducts = productsData.content.result;

        setHasDataBeenFetched(true);
        setIsLoadingMore(false);

        if (offset === 0) {
          // First load or filter change - replace all products
          setAllProducts(newProducts);
        } else {
          // Subsequent loads - append to existing products
          setAllProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const uniqueNewProducts = newProducts.filter(
              (p: any) => !existingIds.has(p.id)
            );
            return [...prev, ...uniqueNewProducts];
          });
        }

        // Update hasMore based on whether we got a full page of results
        const hasMoreData = newProducts.length === 12;
        setHasMore(hasMoreData);
      } else {
        // Handle empty results
        setHasDataBeenFetched(true);
        setIsLoadingMore(false);
        if (offset === 0) {
          setAllProducts([]);
        }
        setHasMore(false);
      }
    }
  }, [productsData, productsLoading, offset]);
  // Fallback effect to ensure products are loaded
  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      if (
        allProducts.length === 0 &&
        !productsLoading &&
        !searchQuery.trim() &&
        !isLoadingMore &&
        !productSearchMutation.data &&
        isInitialized &&
        !productsData
      ) {
        setOffset(0);
        refetchProducts();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    allProducts.length,
    productsLoading,
    searchQuery.trim(),
    isLoadingMore,
    productSearchMutation.data,
    refetchProducts,
    isInitialized,
    productsData,
  ]);
  // Initialize component state once
  useEffect(() => {
    if (!isInitialized) {
      // Clear any existing search state
      if (productSearchMutation.data) {
        productSearchMutation.reset();
      }
      
      // Reset data fetch tracking only if we don't have data
      if (allProducts.length === 0) {
        setHasDataBeenFetched(false);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, productSearchMutation, allProducts.length]);
  // Handle filter changes by updating offset and refetching (without clearing products)
  useEffect(() => {
    if (isInitialized && !isFirstInit && !searchQuery.trim()) {
      setOffset(0); // Reset to first page
      setHasMore(true);
      setIsLoadingMore(false);
      
      // Refetch without clearing existing products first
      setTimeout(() => {
        refetchProducts();
      }, 100);
    } else if (isInitialized && isFirstInit) {
      setIsFirstInit(false);
    }
  }, [selectedCategoryId, priceOrder, selectedCondition, selectedLocations, searchQuery.trim(), isInitialized, isFirstInit, refetchProducts]);

  const hasError =
    productsError ||
    categoriesError ||
    citiesError ||
    productSearchMutation.error;

  const isLoading =
    categoriesLoading || citiesLoading || productSearchMutation.isPending;

  // Updated to handle category ID instead of category name
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // New filter handlers
  const handlePriceOrderChange = (order: "asc" | "desc" | "") => {
    setPriceOrder(order);
  };

  const handleConditionChange = (condition: "new" | "used" | "") => {
    setSelectedCondition(condition);
  };

  const handleLocationToggle = (cityName: string) => {
    setSelectedLocations((prev) => {
      if (prev.includes(cityName)) {
        return prev.filter((loc) => loc !== cityName);
      } else {
        return [...prev, cityName];
      }
    });
  };
  const clearAllFilters = () => {
    setPriceOrder("");
    setSelectedCondition("");
    setSelectedLocations([]);
    setSelectedCategoryId("");
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    if (productSearchMutation.data) {
      productSearchMutation.reset();
    }
    // Note: We don't restore previous filters when clearing search
    // User can manually set filters again if needed
  };
  // Determine if we should show loading state
  const shouldShowLoading =
    (!isInitialized && !allProducts.length) ||
    (productsLoading && allProducts.length === 0 && !hasDataBeenFetched);

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor your product inventory
              </p>
            </div>
            <button
              onClick={() => navigate("/products/create")}
              className="inline-flex items-center justify-center bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-sm"
              style={{ minHeight: "44px" }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Product
            </button>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <MdSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama, kategori, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none text-gray-700 placeholder:text-gray-400"
              />
              {productSearchMutation.isPending && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                </div>
              )}
              {searchQuery && !productSearchMutation.isPending && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <MdClear className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              className="relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 shadow-sm hover:shadow-md"
              onClick={() => setShowFilters(!showFilters)}
            >
              <MdFilterList className="w-5 h-5" />
              <span>Filter</span>
              {showFilters ? (
                <MdKeyboardArrowUp className="w-5 h-5" />
              ) : (
                <MdKeyboardArrowDown className="w-5 h-5" />
              )}
              {(priceOrder ||
                selectedCondition ||
                selectedLocations.length > 0 ||
                selectedCategoryId) && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  {
                    [
                      priceOrder,
                      selectedCondition,
                      ...selectedLocations,
                      selectedCategoryId,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    Kategori
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {categories.map((category) => (
                      <label
                        key={category.id || "all"}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategoryId === category.id}
                          onChange={() => handleCategoryChange(category.id)}
                          className="w-4 h-4 text-accent border-gray-300 focus:ring-accent/50 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Order */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    Urutkan Harga
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "", label: "Default" },
                      { value: "asc", label: "Harga Terendah" },
                      { value: "desc", label: "Harga Tertinggi" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="radio"
                          name="priceOrder"
                          checked={priceOrder === option.value}
                          onChange={() =>
                            handlePriceOrderChange(
                              option.value as "asc" | "desc" | ""
                            )
                          }
                          className="w-4 h-4 text-accent border-gray-300 focus:ring-accent/50 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    Kondisi Barang
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "", label: "Semua Kondisi" },
                      { value: "new", label: "Baru" },
                      { value: "used", label: "Bekas" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="radio"
                          name="condition"
                          checked={selectedCondition === option.value}
                          onChange={() =>
                            handleConditionChange(
                              option.value as "new" | "used" | ""
                            )
                          }
                          className="w-4 h-4 text-accent border-gray-300 focus:ring-accent/50 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                {cities.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Lokasi Produk
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {cities.map((city: City) => (
                        <label
                          key={city.name}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(city.name)}
                            onChange={() => handleLocationToggle(city.name)}
                            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent/50 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                            {city.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              <div className="mt-5 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={clearAllFilters}
                >
                  Hapus Semua Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {(shouldShowLoading || isLoading) && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Memuat produk...</p>
          </div>
        )}

        {/* Error State */}
        {hasError && isInitialized && !productsLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gagal Memuat Produk
            </h3>
            <p className="text-gray-600 mb-4">
              Terjadi kesalahan saat memuat data. Silakan coba lagi.
            </p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!shouldShowLoading &&
          !isLoading &&
          !hasError &&
          filteredProducts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {filteredProducts.map((product: any) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-accent/50 transition-all duration-300 cursor-pointer group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image || "/placeholder-product.png"}
                        alt={product.name || product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-product.png";
                        }}
                      />
                      {/* Condition Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.condition === "new"
                              ? "bg-green-500 text-white"
                              : "bg-gray-700 text-white"
                          }`}
                        >
                          {product.condition === "new" ? "Baru" : "Bekas"}
                        </span>
                      </div>
                      {/* Publish Status */}
                      {product.publish === "1" && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-accent text-white rounded-full text-xs font-semibold">
                            Aktif
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Category */}
                      <div className="text-xs font-medium text-accent mb-2 uppercase tracking-wide">
                        {product.category || "Tanpa Kategori"}
                      </div>

                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-accent transition-colors min-h-[3rem]">
                        {product.name || product.title}
                      </h3>

                      {/* Price */}
                      <div className="text-2xl font-bold text-accent mb-3">
                        {formatPrice(product.price)}
                      </div>

                      {/* Rating & Location */}
                      <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1">
                          <MdStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">
                            {product.rating || "0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MdLocationOn className="w-4 h-4 text-gray-400" />
                          <span className="text-xs truncate max-w-[120px]">
                            {product.city || "Lokasi tidak diketahui"}
                          </span>
                        </div>
                      </div>

                      {/* SKU */}
                      {product.sku && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            SKU: {product.sku}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Results Count */}
              <div className="text-center text-sm text-gray-600 mb-4">
                Menampilkan {filteredProducts.length} produk
                {searchQuery && ` untuk "${searchQuery}"`}
              </div>
            </>
          )}

        {/* Load More Button */}
        {!searchQuery.trim() &&
          hasMore &&
          !isLoadingMore &&
          filteredProducts.length >= 10 &&
          !shouldShowLoading &&
          !isLoading && (
            <div className="flex justify-center mt-8">
              <button
                className="px-8 py-3.5 bg-accent text-white rounded-xl hover:bg-accent-hover transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={() => {
                  setIsLoadingMore(true);
                  setOffset((prev) => prev + 10);
                }}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memuat...</span>
                  </>
                ) : (
                  <>
                    <span>Muat Lebih Banyak</span>
                    <MdKeyboardArrowDown className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

        {/* Empty State */}
        {filteredProducts.length === 0 &&
          allProducts.length === 0 &&
          !productsLoading &&
          !isLoadingMore &&
          isInitialized &&
          hasDataBeenFetched &&
          !productSearchMutation.isPending &&
          !shouldShowLoading && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 opacity-50">
                <img
                  src="/nodata.png"
                  alt="Tidak Ada Produk"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery
                  ? `Tidak ditemukan hasil untuk "${searchQuery}"`
                  : "Produk Tidak Ditemukan"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Coba cari dengan kata kunci lain atau telusuri kategori kami."
                  : "Coba atur ulang pencarian atau filter untuk menemukan produk yang Anda cari."}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-md"
                >
                  Hapus Pencarian
                </button>
              )}
            </div>
          )}
      </div>
    </DashboardLayout>
  );
};
