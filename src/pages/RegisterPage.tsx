import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { provinces, cities, districts } from '../data/locations';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: '',
    type: 'company',
    cp: '',
    npwp: '',
    address: '',
    shipping_province: '',
    shipping_city: '',
    shipping_district: '',
    zip: '',
    phone1: '',
    phone2: '',
    email: '',
    password: '',
    acc_name: '',
    acc_no: '',
    acc_bank: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset dependent fields when province or city changes
    if (name === 'shipping_province') {
      setFormData(prev => ({ ...prev, shipping_city: '', shipping_district: '' }));
    }
    if (name === 'shipping_city') {
      setFormData(prev => ({ ...prev, shipping_district: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    try {
      const result = await registerMutation.mutateAsync(formData);
      if (result.success) {
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
    }
  };

  const availableCities = formData.shipping_province ? cities[formData.shipping_province] || [] : [];
  const availableDistricts = formData.shipping_city ? districts[formData.shipping_city] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-accent/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-xl mb-4 shadow-accent p-3">
            <img src="/lapakbenz.png" alt="LapakBenz Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Create Supplier Account</h1>
          <p className="text-gray-600 mt-2">Register to manage your products on LapakBenz</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {registerMutation.isError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-red-800">
                  {registerMutation.error?.message || 'Registration failed. Please try again.'}
                </p>
              </div>
            )}

            {/* Company Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  >
                    <option value="company">Company</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cp" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    id="cp"
                    name="cp"
                    type="text"
                    value={formData.cp}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="npwp" className="block text-sm font-medium text-gray-700 mb-2">
                    NPWP *
                  </label>
                  <input
                    id="npwp"
                    name="npwp"
                    type="text"
                    value={formData.npwp}
                    onChange={handleChange}
                    required
                    placeholder="123.456.789.0-123.456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div>
                  <label htmlFor="shipping_province" className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    id="shipping_province"
                    name="shipping_province"
                    value={formData.shipping_province}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(prov => (
                      <option key={prov.value} value={prov.value}>{prov.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    id="shipping_city"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    required
                    disabled={!formData.shipping_province || registerMutation.isPending}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:bg-gray-100"
                  >
                    <option value="">Select City</option>
                    {availableCities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="shipping_district" className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <select
                    id="shipping_district"
                    name="shipping_district"
                    value={formData.shipping_district}
                    onChange={handleChange}
                    required
                    disabled={!formData.shipping_city || registerMutation.isPending}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:bg-gray-100"
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(dist => (
                      <option key={dist.value} value={dist.value}>{dist.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    placeholder="20123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone1" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone 1 *
                  </label>
                  <input
                    id="phone1"
                    name="phone1"
                    type="tel"
                    value={formData.phone1}
                    onChange={handleChange}
                    required
                    placeholder="085158781399"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div>
                  <label htmlFor="phone2" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone 2 *
                  </label>
                  <input
                    id="phone2"
                    name="phone2"
                    type="tel"
                    value={formData.phone2}
                    onChange={handleChange}
                    required
                    placeholder="085158781399"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      disabled={registerMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Account Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Bank Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="acc_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    id="acc_name"
                    name="acc_name"
                    type="text"
                    value={formData.acc_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div>
                  <label htmlFor="acc_no" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    id="acc_no"
                    name="acc_no"
                    type="text"
                    value={formData.acc_no}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div>
                  <label htmlFor="acc_bank" className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    id="acc_bank"
                    name="acc_bank"
                    type="text"
                    value={formData.acc_bank}
                    onChange={handleChange}
                    required
                    placeholder="BCA, Mandiri, BNI, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-accent border-gray-300 rounded focus:ring-accent cursor-pointer"
                disabled={registerMutation.isPending}
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-accent hover:text-accent-hover font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-accent hover:text-accent-hover font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending || !agreeTerms}
              className="w-full bg-accent text-white py-3.5 px-4 rounded-lg hover:bg-accent-hover focus:ring-4 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-accent"
              style={{ minHeight: '44px' }}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Supplier Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-accent hover:text-accent-hover transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>&copy; 2025 LapakBenz. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
