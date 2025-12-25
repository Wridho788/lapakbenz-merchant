import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useOrders, useSetAwb } from "../hooks/useOrder";
import toast from "react-hot-toast";
import { PageLoader } from "../components/Loading";
import { ErrorState } from "../components/ErrorState";

export const OrdersPage = () => {
  const [filters, setFilters] = useState({
    limit: "120",
    offset: "0",
    start: "",
    end: "",
    sent: "",
    delivered: "",
    paid: "",
  });

  const [showAwbModal, setShowAwbModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [awbNumber, setAwbNumber] = useState("");

  const { data: ordersData, isLoading, isError, error, refetch } = useOrders(filters);
  const setAwbMutation = useSetAwb();

  const orders = ordersData?.content?.result || [];
  const totalOrders = ordersData?.content?.total_orders || 0;
  const totalOutstanding = ordersData?.content?.total_outstanding || 0;
  const recordCount = ordersData?.content?.record || 0;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    refetch();
  };

  const handleResetFilter = () => {
    setFilters({
      limit: "120",
      offset: "0",
      start: "",
      end: "",
      sent: "",
      delivered: "",
      paid: "",
    });
    setTimeout(() => refetch(), 100);
  };

  const handleOpenAwbModal = (order: any) => {
    setSelectedOrder(order);
    setAwbNumber("");
    setShowAwbModal(true);
  };

  const handleCloseAwbModal = () => {
    setShowAwbModal(false);
    setSelectedOrder(null);
    setAwbNumber("");
  };

  const handleSubmitAwb = async () => {
    if (!awbNumber.trim()) {
      toast.error("Nomor resi tidak boleh kosong");
      return;
    }

    if (!selectedOrder?.id) {
      toast.error("Order tidak valid");
      return;
    }

    try {
      const result = await setAwbMutation.mutateAsync({
        orderId: selectedOrder.id,
        awb: awbNumber,
      });

      if (result.success) {
        toast.success("Nomor resi berhasil disimpan!");
        handleCloseAwbModal();
        refetch();
      } else {
        toast.error(result.message || result.error || "Gagal menyimpan nomor resi");
      }
    } catch (error: any) {
      console.error("Failed to set AWB:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Gagal menyimpan nomor resi";
      toast.error(errorMsg);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string | number, type: "sent" | "delivered" | "paid") => {
    const isTrue = status === "1" || status === 1;
    
    const colors = {
      sent: isTrue ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
      delivered: isTrue ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
      paid: isTrue ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
    };

    const labels = {
      sent: isTrue ? "Terkirim" : "Belum Terkirim",
      delivered: isTrue ? "Sampai" : "Dalam Pengiriman",
      paid: isTrue ? "Dibayar" : "Belum Dibayar",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>
        {labels[type]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <ErrorState message={error?.message || "Gagal memuat data penjualan"} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Penjualan</h1>
          <p className="text-gray-600 mt-1">Kelola pesanan dan pengiriman produk Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalOutstanding}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Data</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{recordCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Penjualan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                name="start"
                value={filters.start}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <input
                type="date"
                name="end"
                value={filters.end}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Kirim</label>
              <select
                name="sent"
                value={filters.sent}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua</option>
                <option value="1">Terkirim</option>
                <option value="0">Belum Terkirim</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Sampai</label>
              <select
                name="delivered"
                value={filters.delivered}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua</option>
                <option value="1">Sudah Sampai</option>
                <option value="0">Dalam Pengiriman</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Bayar</label>
              <select
                name="paid"
                value={filters.paid}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua</option>
                <option value="1">Sudah Dibayar</option>
                <option value="0">Belum Dibayar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
              <input
                type="number"
                name="limit"
                value={filters.limit}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 flex items-end gap-3">
              <button
                onClick={handleApplyFilter}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Terapkan Filter
              </button>
              <button
                onClick={handleResetFilter}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Kirim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Sampai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Bayar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Resi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">Tidak ada data penjualan</p>
                        <p className="text-sm text-gray-400 mt-1">Belum ada pesanan yang masuk</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.created || order.order_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.product_name || order.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.total || order.price || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.sent, "sent")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.delivered, "delivered")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.paid, "paid")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.awb || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleOpenAwbModal(order)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Input Resi
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AWB Modal */}
      {showAwbModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Input Nomor Resi</h3>
              <button
                onClick={handleCloseAwbModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Order ID:</p>
              <p className="text-base font-medium text-gray-900">#{selectedOrder?.id}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Resi *
              </label>
              <input
                type="text"
                value={awbNumber}
                onChange={(e) => setAwbNumber(e.target.value)}
                placeholder="Masukkan nomor resi pengiriman"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={setAwbMutation.isPending}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseAwbModal}
                disabled={setAwbMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitAwb}
                disabled={setAwbMutation.isPending}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {setAwbMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
