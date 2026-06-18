"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calendar, RefreshCw, ShoppingCart, DollarSign } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SalesHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  // Date states
  const [period, setPeriod] = useState("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const updateDatesByPeriod = (p: string) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (p === "today") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (p === "this_month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (p === "last_month") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (p === "this_year") {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (p === "custom") {
      return; // Handled by date pickers
    }

    // Set time explicitly if needed, but for date inputs YYYY-MM-DD is required
    setStartDate(`${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`);
    setEndDate(`${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`);
  };

  useEffect(() => {
    updateDatesByPeriod("this_month");
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchSalesData();
    }
  }, [startDate, endDate]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const result = await adminApi.salesHistory(startDate, endDate);
      if (result.status) {
        setData(result);
      }
    } catch (e) {
      console.error("Failed to fetch sales history", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e: any) => {
    const p = e.target.value;
    setPeriod(p);
    updateDatesByPeriod(p);
  };

  const maxRevenue = data ? Math.max(...data.dailyData.map((d: any) => d.revenue), 1) : 1;

  return (
    <AdminLayout title="Sales History" subtitle="Track your earnings and orders over time">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto bg-white p-2 rounded-xl border border-[#111111]/[0.06] shadow-sm">
          <Calendar className="w-4 h-4 text-[#111111]/40 ml-2" />
          <select 
            value={period} 
            onChange={handlePeriodChange}
            className="bg-transparent text-sm font-medium text-[#111111] focus:outline-none pr-2"
          >
            <option value="today">Today</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
            <option value="custom">Custom Date Range</option>
          </select>
          {period === "custom" && (
            <div className="flex items-center gap-2 border-l border-[#111111]/10 pl-3">
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="text-xs bg-transparent focus:outline-none text-[#111111]"
              />
              <span className="text-[#111111]/30">to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="text-xs bg-transparent focus:outline-none text-[#111111]"
              />
            </div>
          )}
        </div>
        <button 
          onClick={fetchSalesData}
          className="p-2.5 bg-white border border-[#111111]/[0.06] rounded-xl hover:bg-[#F8F6F3] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-[#111111]/60 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C5A47E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111111]/40 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-[#111111]">₹{(data?.totalRevenue || 0).toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111111]/40 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-[#111111]">{data?.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#111111]/[0.03] shadow-sm p-6 overflow-x-auto">
            <h3 className="font-display text-sm font-bold text-[#111111] mb-6">Daily Sales Trend</h3>
            {data?.dailyData?.length > 0 ? (
              <div className="flex items-end gap-2 h-64 min-w-[600px] pt-4">
                {data.dailyData.map((d: any, i: number) => {
                  const height = Math.max((d.revenue / maxRevenue) * 100, 2);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-12 bg-[#111111] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        <p className="font-bold">₹{d.revenue.toLocaleString("en-IN")}</p>
                        <p className="text-white/60">{d.orders} orders</p>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full relative rounded-t-sm overflow-hidden" style={{ height: `${height}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#C5A47E] to-[#C5A47E]/60 hover:from-[#111111] hover:to-[#111111]/80 transition-colors cursor-pointer" />
                      </div>
                      
                      {/* Date Label */}
                      <span className="text-[9px] text-[#111111]/30 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                        {new Date(d.date).getDate()} {new Date(d.date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-[#111111]/30">
                <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No sales data found for this period</p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
