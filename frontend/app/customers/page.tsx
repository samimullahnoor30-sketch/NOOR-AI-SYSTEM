"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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

type CustomerForm = {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

const emptyForm: CustomerForm = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] =
    useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/customers/`);

      if (!response.ok) {
        throw new Error("Failed to load customers.");
      }

      const data: Customer[] = await response.json();

      setCustomers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.full_name,
        customer.phone,
        customer.email,
        customer.address,
        customer.notes,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword)
        )
    );
  }, [customers, search]);

  const activeCustomers = customers.filter(
    (customer) => customer.is_active
  ).length;

  const inactiveCustomers = customers.length - activeCustomers;

  const handleInputChange = (
    field: keyof CustomerForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCustomer(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.full_name.trim() || !form.phone.trim()) {
      setError("Full name and phone are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const isEditing = editingCustomer !== null;

      const url = isEditing
        ? `${API_URL}/api/customers/${editingCustomer.id}`
        : `${API_URL}/api/customers/`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          address: form.address.trim() || null,
          notes: form.notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to save customer."
        );
      }

      await loadCustomers();

      setMessage(
        isEditing
          ? "Customer updated successfully."
          : "Customer added successfully."
      );

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save customer."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);

    setForm({
      full_name: customer.full_name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      notes: customer.notes || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.full_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/customers/${customer.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Failed to delete customer."
        );
      }

      if (editingCustomer?.id === customer.id) {
        resetForm();
      }

      if (viewingCustomer?.id === customer.id) {
        setViewingCustomer(null);
      }

      await loadCustomers();

      setMessage("Customer deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete customer."
      );
    }
  };

  const openViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
    setError("");
    setMessage("");
  };

  const closeCustomerDetails = () => {
    setViewingCustomer(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-slate-950">
              N
            </div>

            <div>
              <p className="text-sm font-medium text-slate-400">
                NOOR AI SYSTEM
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Customer Management
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-slate-400">
            Manage customer records, contact information, notes,
            and account status from one professional workspace.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Total Customers
            </p>

            <p className="mt-2 text-3xl font-bold">
              {customers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Active Customers
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {activeCustomers}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Inactive Customers
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-400">
              {inactiveCustomers}
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {editingCustomer
                  ? "Edit Customer"
                  : "Add Customer"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {editingCustomer
                  ? "Update the customer information below."
                  : "Create a new customer record."}
              </p>
            </div>

            {editingCustomer && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.full_name}
                  onChange={(event) =>
                    handleInputChange(
                      "full_name",
                      event.target.value
                    )
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone
                </label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    handleInputChange(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleInputChange(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Address
                </label>

                <input
                  type="text"
                  value={form.address}
                  onChange={(event) =>
                    handleInputChange(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="Enter address"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    handleInputChange(
                      "notes",
                      event.target.value
                    )
                  }
                  placeholder="Enter customer notes"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingCustomer
                  ? "Update Customer"
                  : "Add Customer"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-800 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Customer Directory
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Search and manage all customer records.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customers..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-400 sm:w-72"
              />

              <button
                type="button"
                onClick={loadCustomers}
                disabled={loading}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1250px] w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                  <th className="px-6 py-4 font-medium">
                    Customer
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Phone
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Email
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Address
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-800/70 transition hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white">
                          {customer.full_name}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          ID #{customer.id}
                        </div>
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
                              ? "bg-emerald-950 text-emerald-300"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {customer.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-400">
                        {formatDate(customer.created_at)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openViewCustomer(customer)
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(customer)
                            }
                            className="rounded-lg border border-blue-900 bg-blue-950/40 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-950"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(customer)
                            }
                            className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-950"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-800 px-6 py-4 text-sm text-slate-500">
            Showing {filteredCustomers.length} of{" "}
            {customers.length} customers
          </div>
        </section>
      </div>

      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-6">
              <div>
                <p className="text-sm text-slate-400">
                  Customer Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {viewingCustomer.full_name}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCustomerDetails}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-xl text-slate-300 transition hover:bg-slate-800"
              >
                ×
              </button>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Customer ID
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  #{viewingCustomer.id}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Status
                </p>

                <p
                  className={`mt-2 text-sm font-semibold ${
                    viewingCustomer.is_active
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {viewingCustomer.is_active
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Phone
                </p>

                <p className="mt-2 text-sm text-slate-200">
                  {viewingCustomer.phone}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Email
                </p>

                <p className="mt-2 text-sm text-slate-200">
                  {viewingCustomer.email || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Address
                </p>

                <p className="mt-2 text-sm text-slate-200">
                  {viewingCustomer.address || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Notes
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                  {viewingCustomer.notes || "No notes available."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Created At
                </p>

                <p className="mt-2 text-sm text-slate-200">
                  {formatDate(viewingCustomer.created_at)}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
              <button
                type="button"
                onClick={closeCustomerDetails}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  closeCustomerDetails();
                  handleEdit(viewingCustomer);
                }}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
