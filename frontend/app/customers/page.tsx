"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/customers/`);

      if (!response.ok) {
        throw new Error("Failed to load customers.");
      }

      const data = await response.json();
      setCustomers(data);
    } catch {
      setError(
        "Unable to connect to the customer database. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const activeCustomers = customers.filter(
    (customer) => customer.is_active
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => !customer.is_active
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              NOOR AI SYSTEM
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Customer Management
            </h1>

            <p className="mt-2 text-slate-400">
              Manage real customer records connected to the NOOR database.
            </p>
          </div>

          <button
            onClick={loadCustomers}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold transition hover:border-cyan-500 hover:bg-slate-800"
          >
            Refresh Customers
          </button>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Customers</p>
            <p className="mt-2 text-3xl font-bold">{customers.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Active Customers</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {activeCustomers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Inactive Customers</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {inactiveCustomers}
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-slate-400">Loading customers...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <p className="font-semibold text-red-400">Connection Error</p>
            <p className="mt-2 text-sm text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-xl font-semibold">Customer Records</h2>
              <p className="mt-1 text-sm text-slate-400">
                Live records retrieved from the NOOR AI SYSTEM backend.
              </p>
            </div>

            {customers.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                No customers found in the database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-950/70">
                    <tr className="border-b border-slate-800 text-sm text-slate-400">
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Phone</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Address</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-slate-800/70 transition hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-5 text-sm text-slate-400">
                          #{customer.id}
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-semibold">
                            {customer.full_name}
                          </div>

                          {customer.notes && (
                            <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                              {customer.notes}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-300">
                          {customer.phone}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-300">
                          {customer.email || "—"}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-300">
                          {customer.address || "—"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              customer.is_active
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {customer.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
