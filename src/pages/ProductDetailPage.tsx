import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail, usePublishProduct, useAddProductImage } from '../hooks/useProduct';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  MdArrowBack,
  MdStar,
  MdEdit,
  MdDelete,
  MdScale,
  MdInventory,
  MdPublish,
  MdAddPhotoAlternate,
  MdImage,
} from 'react-icons/md';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: productData, isLoading, isError, error, refetch } = useProductDetail(id || '');
  const publishProductMutation = usePublishProduct();
  const addProductImageMutation = useAddProductImage();
  console.log('Product Data:', productData);
  // Extract product from API response
  const product = productData?.content;

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
    
    // Main image with full URL
    if (product.image) {
      const imageUrl = product.url_image 
        ? `${product.url_image}${product.image}`
        : product.image;
      images.push(imageUrl);
    }
    
    // Additional images
    if (product.url1) images.push(product.url1);
    if (product.url2) images.push(product.url2);
    if (product.url3) images.push(product.url3);
    if (product.url4) images.push(product.url4);
    if (product.url5) images.push(product.url5);
    
    return images;
  };

  const images = getAllImages();
  const MAX_IMAGES = 5;

  const handlePublishProduct = async () => {
    if (!id) return;
    
    try {
      const result = await publishProductMutation.mutateAsync(id);
      if (result.success) {
        toast.success('Produk berhasil dipublikasikan!');
        refetch();
      } else {
        toast.error(result.message || 'Gagal mempublikasikan produk');
      }
    } catch (error) {
      console.error('Failed to publish product:', error);
      toast.error('Gagal mempublikasikan produk');
    }
  };

  const handleUpdateProduct = () => {
    if (!product || !id) return;
    navigate(`/products/${id}/edit`, { state: { product } });
  };

  const handleDeleteProduct = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      // TODO: Implement delete functionality
      toast.error('Fitur hapus produk belum tersedia');
      console.log('Delete product:', product?.id);
    }
  };

  const handleImageUpload = async (slotIndex: number, file: File) => {
    if (!id) return;

    setUploadingSlot(slotIndex);
    const formData = new FormData();
    formData.append('orders', String(slotIndex + 1));
    formData.append('userfile', file);

    try {
      const result = await addProductImageMutation.mutateAsync({
        productId: id,
        imageData: formData,
      });

      console.log(result)

      if (result.status === 200) {
        toast.success(`Gambar ${slotIndex + 1} berhasil ditambahkan!`);
        refetch();
      } else {
        toast.error(result.message || result.error || 'Gagal menambahkan gambar');
      }
    } catch (error: any) {
      console.error('Failed to add image:', error);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal menambahkan gambar';
      toast.error(errorMsg);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleFileSelect = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(slotIndex, file);
    }
    // Reset input value
    e.target.value = '';
  };

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
          <div className="space-y-6">
            {/* Header Card with Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {product.sku && (
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handlePublishProduct}
                    disabled={publishProductMutation.isPending}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                  >
                    {publishProductMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Proses...</span>
                      </>
                    ) : (
                      <>
                        <MdPublish className="w-4 h-4" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleUpdateProduct}
                    className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-sm hover:shadow text-sm"
                  >
                    <MdEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={handleDeleteProduct}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow text-sm"
                  >
                    <MdDelete className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Images */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Images Gallery */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Gambar Produk
                  </h2>
                  
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
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
                    <div className="grid grid-cols-5 gap-3">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-75 transition-all border-2 ${
                            selectedImage === index
                              ? 'border-accent shadow-md'
                              : 'border-gray-200'
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

                {/* Upload Images Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Upload Gambar Tambahan
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {images.length} / {MAX_IMAGES}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    Upload hingga {MAX_IMAGES} gambar untuk produk Anda. Setiap slot memiliki tombol upload tersendiri.
                  </p>

                  {/* Upload Slots Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: MAX_IMAGES }).map((_, index) => {
                      const hasImage = index < images.length;
                      const isUploading = uploadingSlot === index;

                      return (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <div className={`aspect-square rounded-lg border-2 border-dashed overflow-hidden transition-all ${
                            hasImage
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 bg-gray-50 hover:border-accent hover:bg-accent/5'
                          }`}>
                            {hasImage ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={images[index]}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-product.png';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">
                                    Slot {index + 1}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {isUploading ? (
                                  <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
                                  <MdImage className="w-10 h-10 text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Upload Button */}
                          {!hasImage && (
                            <button
                              onClick={() => fileInputRefs.current[index]?.click()}
                              disabled={isUploading}
                              className="mt-2 w-full flex items-center justify-center gap-1.5 bg-accent text-white px-3 py-2 rounded-lg hover:bg-accent-hover transition-colors font-medium text-xs shadow-sm hover:shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              <MdAddPhotoAlternate className="w-4 h-4" />
                              <span>{isUploading ? 'Upload...' : 'Upload'}</span>
                            </button>
                          )}
                          
                          {hasImage && (
                            <div className="mt-2 text-center">
                              <span className="text-xs text-green-600 font-medium">
                                ✓ Terupload
                              </span>
                            </div>
                          )}

                          {/* Hidden file input */}
                          <input
                            ref={(el) => {
                              fileInputRefs.current[index] = el;
                            }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(index, e)}
                            className="hidden"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {images.length >= MAX_IMAGES && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 text-center font-medium">
                        ✓ Semua slot gambar telah terisi
                      </p>
                    </div>
                  )}
                </div>

                {/* Description Card */}
                {(product.description || product.shortdesc) && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Deskripsi Produk
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description || product.shortdesc}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Price & Status Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-sm font-medium text-gray-600 mb-2">Harga</h2>
                  <p className="text-3xl font-bold text-accent mb-4">
                    {formatPrice(product.price)}
                  </p>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 1
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.status === 1 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></span>
                      {product.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <MdStar className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {product.rating}
                      </span>
                      <span className="text-gray-500 text-sm">/ 5.0</span>
                    </div>
                  )}
                </div>

                {/* Specifications Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Spesifikasi
                  </h2>
                  <div className="space-y-4">
                    {/* Weight */}
                    {product.weight && (
                      <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                        <MdScale className="w-5 h-5 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Berat</p>
                          <p className="font-semibold text-gray-900">
                            {product.weight} gram
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stock/Quantity */}
                    {product.qty && (
                      <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                        <MdInventory className="w-5 h-5 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Stok</p>
                          <p className="font-semibold text-gray-900">
                            {product.qty} unit
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Condition */}
                    {product.conditions && (
                      <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                        <svg
                          className="w-5 h-5 text-accent mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Kondisi</p>
                          <p className="font-semibold text-gray-900">
                            {product.conditions === 'new' ? 'Baru' : 'Bekas'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Product ID */}
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-accent mt-0.5"
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
                        <p className="text-sm text-gray-600 mb-1">Product ID</p>
                        <p className="font-semibold text-gray-900">
                          #{product.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
