"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Service = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  price: string | null;
  duration: string | null;
  is_active: boolean;
  created_at: string;
};

type ServiceForm = {
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
};

const emptyForm: ServiceForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  duration: "",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/services/`);

      if (!response.ok) {
        throw new Error("Failed to load services.");
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter((service) =>
      [
        service.name,
        service.category,
        service.description,
        service.price,
        service.duration,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [services, search]);

  const activeCount = services.filter(
    (service) => service.is_active
  ).length;

  const inactiveCount = services.filter(
    (service) => !service.is_active
  ).length;

  function handleInputChange(
    field: keyof ServiceForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAddForm() {
    setEditingService(null);
    setForm(emptyForm);
    setShowAddForm(true);
    setMessage("");
    setError("");
  }

  function openEditForm(service: Service) {
    setEditingService(service);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description || "",
      price: service.price || "",
      duration: service.duration || "",
    });
    setShowAddForm(true);
    setMessage("");
    setError("");
  }

  function closeForm() {
    setShowAddForm(false);
    setEditingService(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const url = editingService
        ? `${API_URL}/api/services/${editingService.id}`
        : `${API_URL}/api/services/`;

      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description || null,
          price: form.price || null,
          duration: form.duration || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save service.");
      }

      setMessage(
        editingService
          ? "Service updated successfully."
          : "Service created successfully."
      );

      closeForm();
      await fetchServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(service: Service) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/services/${service.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete service.");
      }

      setMessage("Service deleted successfully.");

      if (viewingService?.id === service.id) {
        setViewingService(null);
      }

      await fetchServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete service."
      );
    }
  }

  async function handleToggleStatus(service: Service) {
    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/services/${service.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !service.is_active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update service status.");
      }

      setMessage("Service status updated successfully.");
      await fetchServices();

      if (viewingService?.id === service.id) {
        setViewingService(data);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service status."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              NOOR AI SYSTEM
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Services Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Manage professional services, categories, pricing,
              durations, and service availability.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Add Service
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Total Services</p>
            <p className="mt-2 text-3xl font-bold">{services.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Active Services</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Inactive Services</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {inactiveCount}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Service Directory</h2>
              <p className="mt-1 text-sm text-slate-400">
                Search and manage all registered services.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
            Loading services...
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
            <div className="overflow-x-auto">
              <table className="min-w-[1150px] w-full text-left">
                <thead className="border-b border-slate-800 bg-slate-950/70">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Service
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Category
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Price
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Duration
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Created
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredServices.map((service) => (
                    <tr
                      key={service.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-5">
                        <div className="font-semibold text-white">
                          {service.name}
                        </div>

                        <div className="mt-1 max-w-sm truncate text-xs text-slate-500">
                          {service.description || "No description"}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-300">
                        {service.category}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-300">
                        {service.price || "Not specified"}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-300">
                        {service.duration || "Not specified"}
                      </td>

                      <td className="px-5 py-5">
                        <button
                          onClick={() => handleToggleStatus(service)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            service.is_active
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-400">
                        {formatDate(service.created_at)}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setViewingService(service)}
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300"
                          >
                            View
                          </button>

                          <button
                            onClick={() => openEditForm(service)}
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-amber-500 hover:text-amber-300"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(service)}
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredServices.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No services found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingService ? "Edit Service" : "Add Service"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {editingService
                    ? "Update the selected service information."
                    : "Create a new professional service."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Service Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      handleInputChange("name", event.target.value)
                    }
                    placeholder="e.g. Research Proposal"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>

                  <input
                    required
                    value={form.category}
                    onChange={(event) =>
                      handleInputChange("category", event.target.value)
                    }
                    placeholder="e.g. Research Services"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    handleInputChange("description", event.target.value)
                  }
                  placeholder="Describe the service..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Price
                  </label>

                  <input
                    value={form.price}
                    onChange={(event) =>
                      handleInputChange("price", event.target.value)
                    }
                    placeholder="e.g. Contact for pricing"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Duration
                  </label>

                  <input
                    value={form.duration}
                    onChange={(event) =>
                      handleInputChange("duration", event.target.value)
                    }
                    placeholder="e.g. 2-3 business days"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingService
                      ? "Update Service"
                      : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                  Service Details
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {viewingService.name}
                </h2>
              </div>

              <button
                onClick={() => setViewingService(null)}
                className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Category</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {viewingService.category}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    viewingService.is_active
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {viewingService.is_active ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Price</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {viewingService.price || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Duration</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {viewingService.duration || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 md:col-span-2">
                <p className="text-xs text-slate-500">Description</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {viewingService.description || "No description provided."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 md:col-span-2">
                <p className="text-xs text-slate-500">Created</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {formatDate(viewingService.created_at)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
              <button
                onClick={() => {
                  openEditForm(viewingService);
                  setViewingService(null);
                }}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Edit Service
              </button>

              <button
                onClick={() => setViewingService(null)}
                className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
