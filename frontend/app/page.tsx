export default function Home() {
  const services = [
    {
      title: "CV & Job Application",
      description:
        "Create professional CVs, Cover Letters, Motivation Letters, and job applications.",
      icon: "📄",
    },
    {
      title: "Research & Monograph",
      description:
        "Create research proposals, monographs, literature reviews, and academic documents.",
      icon: "🎓",
    },
    {
      title: "Questionnaire & Research Instrument",
      description:
        "Design professional questionnaires and research instruments based on research objectives and variables.",
      icon: "📝",
    },
    {
      title: "Data Analysis",
      description:
        "Perform statistical analysis using SPSS, AMOS, SmartPLS, and other analytical tools.",
      icon: "📊",
    },
    {
      title: "Seminar & Presentation",
      description:
        "Create professional seminar documents, academic presentations, and PowerPoint content.",
      icon: "📽️",
    },
    {
      title: "Translation",
      description:
        "Provide professional translation between English, Pashto, Dari, and other languages.",
      icon: "🌐",
    },
    {
      title: "Business Planning",
      description:
        "Create short-term, medium-term, and long-term professional business plans.",
      icon: "💼",
    },
    {
      title: "Documents & Files",
      description:
        "Manage projects, documents, uploaded files, templates, and generated reports.",
      icon: "📁",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">NOOR AI SYSTEM</h1>

            <p className="mt-1 text-sm text-slate-500">
              Noor Professional Online Service
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium">
            Admin Dashboard
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-blue-600">
              Intelligent Professional Services
            </p>

            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              NOOR AI SYSTEM
              <br />
              Professional Management Platform
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              A centralized intelligent platform for customer management,
              research services, document generation, data analysis,
              presentations, translation, and business services.
            </p>
          </div>

          {/* Services */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-3xl">{service.icon}</div>

                <h3 className="mt-4 text-lg font-bold">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {service.description}
                </p>

                <button className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Customers</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active Projects</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed Projects</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Available Services</p>
            <p className="mt-2 text-3xl font-bold">{services.length}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">
        Noor — From Service to Success, Always With You
      </footer>
    </main>
  );
}
