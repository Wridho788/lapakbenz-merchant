import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAddProduct, useUpdateProduct } from '../hooks/useProduct';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ErrorAlert } from '../components/ErrorState';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const isEditMode = !!id;
  const productData = location.state?.product;
  
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const [showError, setShowError] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    condition: '',
    qty: '',
    shortdesc: '',
    bestseller: '0',
    latest: '0',
    rating: '0',
    weight: '',
  });

  useEffect(() => {
    if (isEditMode && productData) {
      setFormData({
        name: productData.name || '',
        price: productData.price || '',
        category: productData.category || '',
        condition: productData.condition || '',
        qty: productData.qty || '',
        shortdesc: productData.shortdesc || '',
        bestseller: productData.bestseller || '0',
        latest: productData.latest || '0',
        rating: productData.rating || '0',
        weight: productData.weight || '',
      });
    }
  }, [isEditMode, productData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowError(true);

    // Validasi gambar wajib untuk add mode
    if (!isEditMode && !imageFile) {
      toast.error('Gambar produk wajib diupload!');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('qty', formData.qty);
      data.append('shortdesc', formData.shortdesc);
      
      if (isEditMode) {
        data.append('bestseller', formData.bestseller);
        data.append('latest', formData.latest);
        data.append('rating', formData.rating);
        data.append('weight', formData.weight);
      }
      
      // Upload gambar untuk add mode (wajib) atau edit mode (opsional)
      if (imageFile) {
        data.append('userfile', imageFile);
      }

      if (isEditMode && id) {
        const result = await updateProductMutation.mutateAsync({ productId: id, data });
        if (result.success) {
          toast.success('Produk berhasil diperbarui!');
          navigate('/products');
        } else {
          toast.error(result.message || result.error || 'Gagal memperbarui produk');
        }
      } else {
        const result = await addProductMutation.mutateAsync(data);
        if (result.success) {
          toast.success('Produk berhasil dibuat!');
          navigate('/products');
        } else {
          toast.error(result.message || result.error || 'Gagal membuat produk');
        }
      }
    } catch (error: any) {
      console.error('Failed to save product:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Gagal menyimpan produk';
      toast.error(errorMessage);
    }
  };

  // Validasi form: semua field wajib terisi, gambar wajib untuk add mode
  const isFormValid = () => {
    const baseValidation = 
      formData.name.trim() !== '' &&
      formData.price.trim() !== '' &&
      formData.category.trim() !== '' &&
      formData.condition.trim() !== '' &&
      formData.qty.trim() !== '' &&
      formData.shortdesc.trim() !== '';

    // Untuk add mode, gambar wajib ada
    if (!isEditMode) {
      return baseValidation && imageFile !== null;
    }

    // Untuk edit mode, gambar opsional
    return baseValidation;
  };

  const isPending = isEditMode ? updateProductMutation.isPending : addProductMutation.isPending;
  const error = isEditMode ? updateProductMutation.error : addProductMutation.error;
  const isError = isEditMode ? updateProductMutation.isError : addProductMutation.isError;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Produk
        </button>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditMode ? 'Edit Produk' : 'Buat Produk Baru'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isError && showError && (
                <ErrorAlert
                  message={error?.message || 'Gagal menyimpan produk. Silakan coba lagi.'}
                  onDismiss={() => setShowError(false)}
                />
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Produk *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="shortdesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Singkat *
                </label>
                <textarea
                  id="shortdesc"
                  name="shortdesc"
                  value={formData.shortdesc}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Harga (Rp) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-2">
                    Stok *
                  </label>
                  <input
                    id="qty"
                    name="qty"
                    type="number"
                    min="0"
                    value={formData.qty}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Kondisi *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    disabled={isPending}
                  >
                    <option value="">Pilih Kondisi</option>
                    <option value="new">Baru</option>
                    <option value="used">Bekas</option>
                  </select>
                </div>
              </div>

              {isEditMode && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                        Berat (gram)
                      </label>
                      <input
                        id="weight"
                        name="weight"
                        type="number"
                        min="0"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (0-5)
                      </label>
                      <input
                        id="rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bestseller" className="block text-sm font-medium text-gray-700 mb-2">
                        Bestseller
                      </label>
                      <select
                        id="bestseller"
                        name="bestseller"
                        value={formData.bestseller}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        disabled={isPending}
                      >
                        <option value="0">Tidak</option>
                        <option value="1">Ya</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="latest" className="block text-sm font-medium text-gray-700 mb-2">
                        Produk Terbaru
                      </label>
                      <select
                        id="latest"
                        name="latest"
                        value={formData.latest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        disabled={isPending}
                      >
                        <option value="0">Tidak</option>
                        <option value="1">Ya</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="userfile" className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Produk {!isEditMode && '*'}
                </label>
                <input
                  id="userfile"
                  name="userfile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!isEditMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isPending}
                />
                {imageFile && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ File terpilih: {imageFile.name}
                  </p>
                )}
                {!isEditMode && !imageFile && (
                  <p className="mt-2 text-sm text-red-600">
                    * Gambar produk wajib diupload untuk produk baru
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isPending || !isFormValid()}
                  className="flex-1 bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent-hover focus:ring-4 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  style={{ minHeight: '44px' }}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {isEditMode ? 'Menyimpan...' : 'Membuat...'}
                    </span>
                  ) : (
                    isEditMode ? 'Simpan Perubahan' : 'Buat Produk'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  style={{ minHeight: '44px' }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
