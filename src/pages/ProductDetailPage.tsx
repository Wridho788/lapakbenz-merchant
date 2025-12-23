import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProduct';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useState } from 'react';
import {
  MdArrowBack,
  MdStar,
  MdEdit,
  MdDelete,
  MdScale,
  MdInventory,
} from 'react-icons/md';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: productData, isLoading, isError, error, refetch } = useProductDetail(id || '');
  
  // Extract product from API response
  const product = productData?.data;

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Collect all images (main image + url1-url6)
  const getAllImages = () => {
    if (!product) return [];
    const images = [];
    if (product.image) images.push(product.image);
    if (product.url1) images.push(product.url1);
    if (product.url2) images.push(product.url2);
    if (product.url3) images.push(product.url3);
    if (product.url4) images.push(product.url4);
    if (product.url5) images.push(product.url5);
    if (product.url6) images.push(product.url6);
    return images;
  };

  const images = getAllImages();

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors font-medium"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Kembali ke Daftar Produk</span>
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Memuat detail produk...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
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
              {error?.message || 'Produk tidak ditemukan atau terjadi kesalahan.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Kembali
              </button>
            </div>
          </div>
        )}

        {/* Product Details */}
        {product && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Images Section */}
              <div>
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <img
                    src={images[selectedImage] || '/placeholder-product.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.png';
                    }}
                  />
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-75 transition-all ${
                          selectedImage === index
                            ? 'ring-2 ring-accent ring-offset-2'
                            : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.png';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information Section */}
              <div className="flex flex-col">
                {/* SKU */}
                {product.sku && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                  </div>
                )}

                {/* Product Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1">
                      <MdStar className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">/ 5.0</span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Harga</p>
                  <p className="text-4xl lg:text-5xl font-bold text-accent">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      product.status === 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.status === 1 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    {product.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>

                {/* Description */}
                {(product.description || product.shortdesc) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Deskripsi Produk
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description || product.shortdesc}
                    </p>
                  </div>
                )}

                {/* Product Specifications */}
                <div className="mb-6 p-5 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Spesifikasi
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Weight */}
                    {product.weight && (
                      <div className="flex items-start gap-3">
                        <MdScale className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Berat</p>
                          <p className="font-semibold text-gray-900">
                            {product.weight} gram
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Restricted */}
                    <div className="flex items-start gap-3">
                      <MdInventory className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Status Pengiriman</p>
                        <p className="font-semibold text-gray-900">
                          {product.restricted === 'N'
                            ? 'Tidak Terbatas'
                            : 'Terbatas'}
                        </p>
                      </div>
                    </div>

                    {/* Period */}
                    {product.period && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-gray-400 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">Periode</p>
                          <p className="font-semibold text-gray-900">
                            {product.period}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Product ID */}
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Product ID</p>
                        <p className="font-semibold text-gray-900">
                          #{product.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    className="flex items-center justify-center gap-2 flex-1 bg-accent text-white px-6 py-3.5 rounded-xl hover:bg-accent-hover transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    <MdEdit className="w-5 h-5" />
                    <span>Edit Produk</span>
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Apakah Anda yakin ingin menghapus produk ini?'
                        )
                      ) {
                        // TODO: Implement delete functionality
                        console.log('Delete product:', product.id);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
                  >
                    <MdDelete className="w-5 h-5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
