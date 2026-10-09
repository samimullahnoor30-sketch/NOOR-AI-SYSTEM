
"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type DocumentRecord = {
  id: number;
  title: string;
  document_type: string;
  customer_id: number | null;
  project_id: number | null;
  file_path: string | null;
  description: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
};

const emptyForm = {
  title: "",
  document_type: "Research",
  customer_id: "",
  project_id: "",
  file_path: "",
  description: "",
  status: "Draft",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/documents/`);

      if (!response.ok) {
        throw new Error("Unable to load documents.");
      }

      const data: DocumentRecord[] = await response.json();
      setDocuments(data);
    } catch {
      setError(
        "Could not connect to the backend. Please ensure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const filteredDocuments = documents.filter((document) => {
    const term = search.toLowerCase();

    const matchesSearch =
      document.title.toLowerCase().includes(term) ||
      document.document_type.toLowerCase().includes(term) ||
      (document.description || "").toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || document.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function updateField(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setSelected(null);
    setError("");
    setNotice("");
  }

  function openEditForm(document: DocumentRecord) {
    setForm({
      title: document.title,
      document_type: document.document_type,
      customer_id: document.customer_id?.toString() || "",
      project_id: document.project_id?.toString() || "",
      file_path: document.file_path || "",
      description: document.description || "",
      status: document.status,
    });

    setEditingId(document.id);
    setShowForm(true);
    setSelected(null);
    setError("");
    setNotice("");
  }

  async function saveDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      title: form.title.trim(),
      document_type: form.document_type,
      customer_id: form.customer_id
        ? Number(form.customer_id)
        : null,
      project_id: form.project_id
        ? Number(form.project_id)
        : null,
      file_path: form.file_path.trim() || null,
      description: form.description.trim() || null,
      status: form.status,
    };

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/api/documents/${editingId}`
          : `${API_URL}/api/documents/`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to save document.");
      }

      await loadDocuments();
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      setNotice(
        editingId
          ? "Document updated successfully."
          : "Document created successfully."
      );
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "An unexpected error occurred."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteDocument(document: DocumentRecord) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/api/documents/${document.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete document.");
      }

      await loadDocuments();
      setSelected(null);
      setNotice("Document deleted successfully.");
    } catch {
      setError("Could not delete the document. Please try again.");
    }
  }

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  } as const;

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    marginTop: "6px",
    background: "#ffffff",
    color: "#111827",
  } as const;

  const buttonStyle = {
    padding: "9px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  } as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: 750 }}>
              Documents Management
            </h1>
            <p style={{ color: "#64748b", marginTop: "8px" }}>
              Create, organize, review, and manage your documents.
            </p>
          </div>

          <button
            style={{
              ...buttonStyle,
              background: "#2563eb",
              color: "#ffffff",
              borderColor: "#2563eb",
            }}
            onClick={openCreateForm}
          >
            + New Document
          </button>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              ...cardStyle,
              borderColor: "#fca5a5",
              color: "#b91c1c",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            style={{
              ...cardStyle,
              borderColor: "#86efac",
              color: "#166534",
              marginBottom: "16px",
            }}
          >
            {notice}
          </div>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Documents", value: documents.length },
            {
              label: "Drafts",
              value: documents.filter((item) => item.status === "Draft")
                .length,
            },
            {
              label: "In Review",
              value: documents.filter((item) => item.status === "In Review")
                .length,
            },
            {
              label: "Completed",
              value: documents.filter((item) => item.status === "Completed")
                .length,
            },
          ].map((stat) => (
            <div key={stat.label} style={cardStyle}>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 750,
                  marginTop: "8px",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {showForm && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <h2 style={{ fontSize: "21px", fontWeight: 700 }}>
              {editingId ? "Edit Document" : "Create New Document"}
            </h2>

            <form
              onSubmit={saveDocument}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
                marginTop: "20px",
              }}
            >
              <label>
                Document Title *
                <input
                  style={inputStyle}
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  placeholder="Enter document title"
                />
              </label>

              <label>
                Document Type *
                <select
                  style={inputStyle}
                  required
                  value={form.document_type}
                  onChange={(event) =>
                    updateField("document_type", event.target.value)
                  }
                >
                  <option value="Research">Research</option>
                  <option value="Monograph">Monograph</option>
                  <option value="Proposal">Proposal</option>
                  <option value="CV">CV</option>
                  <option value="Cover Letter">Cover Letter</option>
                  <option value="Questionnaire">Questionnaire</option>
                  <option value="Report">Report</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Translation">Translation</option>
                  <option value="Business Plan">Business Plan</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Customer ID (Optional)
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  value={form.customer_id}
                  onChange={(event) =>
                    updateField("customer_id", event.target.value)
                  }
                  placeholder="Enter customer ID"
                />
              </label>

              <label>
                Project ID (Optional)
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  value={form.project_id}
                  onChange={(event) =>
                    updateField("project_id", event.target.value)
                  }
                  placeholder="Enter project ID"
                />
              </label>

              <label>
                Status
                <select
                  style={inputStyle}
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                >
                  <option value="Draft">Draft</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>

              <label>
                File Path (Optional)
                <input
                  style={inputStyle}
                  value={form.file_path}
                  onChange={(event) =>
                    updateField("file_path", event.target.value)
                  }
                  placeholder="Enter saved file path"
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                Description (Optional)
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Enter document details"
                />
              </label>

              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...buttonStyle,
                    background: "#2563eb",
                    color: "#ffffff",
                    borderColor: "#2563eb",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Document"}
                </button>

                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {selected && (
          <section style={{ ...cardStyle, marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ fontSize: "21px", fontWeight: 700 }}>
                Document Details
              </h2>
              <button
                style={buttonStyle}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginTop: "18px",
              }}
            >
              {[
                ["Title", selected.title],
                ["Type", selected.document_type],
                ["Status", selected.status],
                ["Customer ID", selected.customer_id ?? "Not assigned"],
                ["Project ID", selected.project_id ?? "Not assigned"],
                ["File Path", selected.file_path || "Not provided"],
                [
                  "Created At",
                  new Date(selected.created_at).toLocaleString(),
                ],
                ["Description", selected.description || "No description"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      marginBottom: "5px",
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ overflowWrap: "anywhere" }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                style={buttonStyle}
                onClick={() => openEditForm(selected)}
              >
                Edit Document
              </button>
              <button
                style={{
                  ...buttonStyle,
                  color: "#b91c1c",
                  borderColor: "#fca5a5",
                }}
                onClick={() => void deleteDocument(selected)}
              >
                Delete Document
              </button>
            </div>
          </section>
        )}

        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "21px", fontWeight: 700 }}>
              All Documents
            </h2>
            <button
              style={buttonStyle}
              onClick={() => void loadDocuments()}
            >
              Refresh
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(200px, 1fr) 200px",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <input
              style={{ ...inputStyle, marginTop: 0 }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search documents..."
              aria-label="Search documents"
            />

            <select
              style={{ ...inputStyle, marginTop: 0 }}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <p style={{ padding: "28px", textAlign: "center" }}>
              Loading documents...
            </p>
          ) : filteredDocuments.length === 0 ? (
            <div
              style={{
                padding: "40px 16px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: 650 }}>
                No documents found
              </p>
              <p style={{ marginTop: "8px" }}>
                Create a document to get started.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  minWidth: "760px",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {[
                      "Title",
                      "Type",
                      "Status",
                      "Created",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "13px 12px",
                          borderBottom: "1px solid #e5e7eb",
                          fontSize: "13px",
                          color: "#475569",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredDocuments.map((document) => (
                    <tr key={document.id}>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                          fontWeight: 600,
                        }}
                      >
                        {document.title}
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {document.document_type}
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 9px",
                            borderRadius: "999px",
                            background:
                              document.status === "Completed"
                                ? "#dcfce7"
                                : document.status === "Approved"
                                  ? "#dbeafe"
                                  : "#f1f5f9",
                            color:
                              document.status === "Completed"
                                ? "#166534"
                                : document.status === "Approved"
                                  ? "#1d4ed8"
                                  : "#475569",
                            fontSize: "12px",
                            fontWeight: 650,
                          }}
                        >
                          {document.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {new Date(document.created_at).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            style={buttonStyle}
                            onClick={() => setSelected(document)}
                          >
                            View
                          </button>
                          <button
                            style={buttonStyle}
                            onClick={() => openEditForm(document)}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              ...buttonStyle,
                              color: "#b91c1c",
                              borderColor: "#fca5a5",
                            }}
                            onClick={() => void deleteDocument(document)}
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
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "13px",
            marginTop: "28px",
          }}
        >
          NOOR AI SYSTEM · Documents Management
        </footer>
      </div>
    </main>
  );
}
