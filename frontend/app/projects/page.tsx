"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const projectTypes = [
  "Research & Monograph",
  "Research Proposal",
  "Questionnaire",
  "Data Analysis",
  "CV & Job Application",
  "Seminar & Presentation",
  "Translation",
  "Business Plan",
  "Other",
];

const statusOptions = [
  "New",
  "In Progress",
  "Under Review",
  "Completed",
  "Cancelled",
];

const priorityOptions = ["Low", "Normal", "High", "Urgent"];

type Project = {
  id: number;
  title: string;
  project_type: string;
  customer_id: number | null;
  description: string | null;
  status: string;
  priority: string;
  is_active: boolean;
  created_at: string;
};

type Customer = {
  id: number;
  full_name: string;
  phone: string;
};

type ProjectForm = {
  title: string;
  project_type: string;
  customer_id: string;
  description: string;
  status: string;
  priority: string;
};

const emptyForm: ProjectForm = {
  title: "",
  project_type: "Research & Monograph",
  customer_id: "",
  description: "",
  status: "New",
  priority: "Normal",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState<ProjectForm>(emptyForm);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [projectsResponse, customersResponse] = await Promise.all([
        fetch(`${API_URL}/api/projects/`),
        fetch(`${API_URL}/api/customers/`),
      ]);

      if (!projectsResponse.ok) {
        throw new Error("Unable to load projects.");
      }

      const projectsData: Project[] = await projectsResponse.json();
      setProjects(projectsData);

      if (customersResponse.ok) {
        const customersData: Customer[] =
          await customersResponse.json();
        setCustomers(customersData);
      } else {
        setCustomers([]);
      }
    } catch {
      setError(
        "Could not connect to the backend. Make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.project_type.toLowerCase().includes(query) ||
        (project.description || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const counts = {
    total: projects.length,
    new: projects.filter((project) => project.status === "New").length,
    progress: projects.filter(
      (project) => project.status === "In Progress"
    ).length,
    completed: projects.filter(
      (project) => project.status === "Completed"
    ).length,
  };

  function openCreateForm() {
    setEditingProject(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(project: Project) {
    setEditingProject(project);
    setFormData({
      title: project.title,
      project_type: project.project_type,
      customer_id:
        project.customer_id === null ? "" : String(project.customer_id),
      description: project.description || "",
      status: project.status,
      priority: project.priority,
    });
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProject(null);
    setFormData(emptyForm);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: formData.title.trim(),
      project_type: formData.project_type,
      customer_id: formData.customer_id
        ? Number(formData.customer_id)
        : null,
      description: formData.description.trim() || null,
      status: formData.status,
      priority: formData.priority,
    };

    try {
      const url = editingProject
        ? `${API_URL}/api/projects/${editingProject.id}`
        : `${API_URL}/api/projects/`;

      const response = await fetch(url, {
        method: editingProject ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to save project.");
      }

      closeForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${project.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete project.");
      }

      if (viewingProject?.id === project.id) {
        setViewingProject(null);
      }

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete project."
      );
    }
  }

  function getCustomerName(customerId: number | null) {
    if (customerId === null) return "Unassigned";

    return (
      customers.find((customer) => customer.id === customerId)?.full_name ||
      `Customer #${customerId}`
    );
  }

  function statusClass(status: string) {
    switch (status) {
      case "Completed":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
      case "In Progress":
        return "border-blue-500/30 bg-blue-500/10 text-blue-300";
      case "Under Review":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "Cancelled":
        return "border-red-500/30 bg-red-500/10 text-red-300";
      default:
        return "border-slate-500/30 bg-slate-500/10 text-slate-300";
    }
  }

  function priorityClass(priority: string) {
    switch (priority) {
      case "Urgent":
        return "text-red-300";
      case "High":
        return "text-orange-300";
      case "Low":
        return "text-slate-400";
      default:
        return "text-blue-300";
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none focus:border-blue-400";

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#091321] p-5 lg:block">
          <div className="mb-10">
            <div className="text-2xl font-black tracking-wider">
              NOOR<span className="text-blue-400"> AI</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Professional Service Platform
            </p>
          </div>

          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/"],
              ["Customers", "/customers"],
              ["Services", "/services"],
              ["Projects", "/projects"],
              ["Documents", "/documents"],
              ["Analytics", "/analytics"],
              ["Settings", "/settings"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={`block rounded-xl px-4 py-3 text-sm transition ${
                  href === "/projects"
                    ? "bg-blue-500/15 font-semibold text-blue-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-semibold">NOOR AI SYSTEM</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              From Service to Success, Always With You.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Workspace / Management
              </p>
              <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                Projects
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Create, track, and manage customer projects.
              </p>
            </div>

            <button
              onClick={openCreateForm}
              className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-400"
            >
              + New Project
            </button>
          </header>

          <div className="space-y-7 p-5 md:p-8">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                <p>{error}</p>
                <button
                  onClick={() => void loadData()}
                  className="mt-2 font-semibold underline"
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Total Projects",
                  value: counts.total,
                  accent: "text-white",
                },
                {
                  label: "New Projects",
                  value: counts.new,
                  accent: "text-blue-300",
                },
                {
                  label: "In Progress",
                  value: counts.progress,
                  accent: "text-amber-300",
                },
                {
                  label: "Completed",
                  value: counts.completed,
                  accent: "text-emerald-300",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-[#0b1726] p-5"
                >
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className={`mt-3 text-3xl font-bold ${item.accent}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1726]">
              <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold">All Projects</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredProjects.length} project(s) found
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search projects..."
                    className={inputClass + " sm:w-64"}
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className={inputClass + " sm:w-44"}
                    aria-label="Filter by status"
                  >
                    <option value="All">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => void loadData()}
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-sm text-slate-400">
                  Loading projects...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl">📁</div>
                  <h3 className="mt-4 font-semibold">No Projects Found</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Create a project or change your search filters.
                  </p>
                  <button
                    onClick={openCreateForm}
                    className="mt-5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold hover:bg-blue-400"
                  >
                    Create First Project
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Project</th>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Priority</th>
                        <th className="px-5 py-4">Created</th>
                        <th className="px-5 py-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-5">
                            <button
                              onClick={() => setViewingProject(project)}
                              className="text-left font-semibold hover:text-blue-300"
                            >
                              {project.title}
                            </button>
                            <p className="mt-1 text-xs text-slate-500">
                              {project.project_type}
                            </p>
                          </td>

                          <td className="px-5 py-5 text-slate-300">
                            {getCustomerName(project.customer_id)}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </td>

                          <td
                            className={`px-5 py-5 font-semibold ${priorityClass(project.priority)}`}
                          >
                            {project.priority}
                          </td>

                          <td className="px-5 py-5 text-slate-400">
                            {new Date(project.created_at).toLocaleDateString()}
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setViewingProject(project)}
                                className="font-medium text-blue-300 hover:text-blue-200"
                              >
                                View
                              </button>
                              <button
                                onClick={() => openEditForm(project)}
                                className="font-medium text-amber-300 hover:text-amber-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => void handleDelete(project)}
                                className="font-medium text-red-300 hover:text-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b1726] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <h2 className="text-xl font-bold">
                  {editingProject ? "Edit Project" : "Create Project"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the project information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Project Title *
                </label>
                <input
                  required
                  maxLength={200}
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({ ...formData, title: event.target.value })
                  }
                  placeholder="Enter project title"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Project Type *
                </label>
                <select
                  required
                  value={formData.project_type}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      project_type: event.target.value,
                    })
                  }
                  className={inputClass}
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Customer
                </label>
                <select
                  value={formData.customer_id}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      customer_id: event.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option value="">No Customer Assigned</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.full_name} — {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  placeholder="Enter project details..."
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        status: event.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        priority: event.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProject
                      ? "Update Project"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b1726] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Project Details
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {viewingProject.title}
                </h2>
              </div>

              <button
                onClick={() => setViewingProject(null)}
                className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close project details"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">Project Type</p>
                <p className="mt-2 font-semibold">
                  {viewingProject.project_type}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">Customer</p>
                <p className="mt-2 font-semibold">
                  {getCustomerName(viewingProject.customer_id)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(viewingProject.status)}`}
                >
                  {viewingProject.status}
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">Priority</p>
                <p
                  className={`mt-2 font-semibold ${priorityClass(viewingProject.priority)}`}
                >
                  {viewingProject.priority}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:col-span-2">
                <p className="text-xs text-slate-500">Description</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {viewingProject.description || "No description provided."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">Created</p>
                <p className="mt-2 text-sm">
                  {new Date(viewingProject.created_at).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">Project ID</p>
                <p className="mt-2 font-semibold">#{viewingProject.id}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 p-6">
              <button
                onClick={() => setViewingProject(null)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const project = viewingProject;
                  setViewingProject(null);
                  openEditForm(project);
                }}
                className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold hover:bg-blue-400"
              >
                Edit Project
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
