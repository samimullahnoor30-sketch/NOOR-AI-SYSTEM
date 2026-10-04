const customers = [
  {
    id: 1,
    name: "Ahmad Khan",
    phone: "+93 700 000 001",
    email: "ahmad@example.com",
    service: "CV & Job Application",
    status: "Active",
  },
  {
    id: 2,
    name: "Fatima Ahmadi",
    phone: "+93 700 000 002",
    email: "fatima@example.com",
    service: "Research & Monograph",
    status: "Active",
  },
  {
    id: 3,
    name: "Mohammad Rahimi",
    phone: "+93 700 000 003",
    email: "mohammad@example.com",
    service: "Data Analysis",
    status: "Completed",
  },
];

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              NOOR AI SYSTEM
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Customer Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage customers, services, and customer information.
            </p>
          </div>

          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700">
            + Add Customer
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Customers
            </p>

            <p className="mt-3 text-3xl font-bold">3</p>

            <p className="mt-2 text-xs text-emerald-600">
              Customer database
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active Customers
            </p>

            <p className="mt-3 text-3xl font-bold">2</p>

            <p className="mt-2 text-xs text-emerald-600">
              Currently active
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed Services
            </p>

            <p className="mt-3 text-3xl font-bold">1</p>

            <p className="mt-2 text-xs text-blue-600">
              Successfully completed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Available Services
            </p>

            <p className="mt-3 text-3xl font-bold">8</p>

            <p className="mt-2 text-xs text-purple-600">
              NOOR AI SYSTEM
            </p>
          </div>
        </div>

        {/* Customer Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold">Customers</h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage all registered customers.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search customers..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white md:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {customer.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold">{customer.name}</p>

                          <p className="text-xs text-slate-500">
                            Customer #{customer.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {customer.phone}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {customer.email}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                        {customer.service}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          customer.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button className="mr-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-slate-100">
                        Edit
                      </button>

                      <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
