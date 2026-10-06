"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const services = [
  {
    title: "CV & Job Application",
    description:
      "Create professional CVs, Cover Letters, Motivation Letters, and complete job applications.",
    icon: "📄",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Research & Monograph",
    description:
      "Develop research proposals, monographs, literature reviews, and academic documents.",
    icon: "🎓",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "Questionnaire & Research",
    description:
      "Design professional questionnaires and research instruments based on research objectives.",
    icon: "📝",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Data Analysis",
    description:
      "Analyze research data using SPSS, AMOS, SmartPLS, EViews, and advanced statistical methods.",
    icon: "📊",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    title: "Seminar & Presentation",
    description:
      "Create professional seminar documents, academic presentations, and PowerPoint content.",
    icon: "📽️",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Translation",
    description:
      "Provide professional translation between English, Pashto, Dari, and other languages.",
    icon: "🌐",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Business Planning",
    description:
      "Create short-term, medium-term, and long-term professional business plans.",
    icon: "💼",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Documents & Files",
    description:
      "Manage customers, projects, documents, uploaded files, templates, and generated reports.",
    icon: "📁",
    gradient: "from-slate-500 to-slate-700",
  },
];

const baseStatistics = [
  {
    title: "Total Customers",
    value: "0",
    description: "Customer database",
    icon: "👥",
  },
  {
    title: "Active Projects",
    value: "0",
    description: "Currently in progress",
    icon: "📋",
  },
  {
    title: "Completed Projects",
    value: "0",
    description: "Successfully completed",
    icon: "✅",
  },
];

export default function Home() {
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    async function loadServiceCount() {
      try {
        const response = await fetch(`${API_URL}/api/services/`);

        if (!response.ok) {
          throw new Error("Failed to load services.");
        }

        const data = await response.json();
        setServiceCount(data.length);
      } catch (error) {
        console.error("Failed to load service count:", error);
      }
    }

    loadServiceCount();
  }, []);

  const statistics = [
    ...baseStatistics,
    {
      title: "Available Services",
      value: String(serviceCount),
      description: "Professional services",
      icon: "⚡",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-white/[0.03] backdrop-blur-xl lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-black shadow-lg shadow-blue-500/20">
                N
              </div>

              <div>
                <h1 className="font-bold tracking-wide">
                  NOOR AI SYSTEM
                </h1>

                <p className="text-xs text-slate-400">
                  Professional Platform
                </p>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="mt-10 space-y-2">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Main Menu
              </p>

              <a
                href="/"
                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
              >
                <span>🏠</span>
                Dashboard
              </a>

              <a
                href="/customers"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <span>👥</span>
                Customers
              </a>

              <a
                href="/services"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <span>🧩</span>
                Services
              </a>

              <a
                href="#projects"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <span>📋</span>
                Projects
              </a>

              <a
                href="#documents"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <span>📁</span>
                Documents
              </a>
            </nav>

            {/* Management Navigation */}
            <nav className="mt-8 space-y-2">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Management
              </p>

              <a
                href="#analytics"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <span>📊</span>
                Analytics
              </a>

              <a
                href="#settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <span>⚙️</span>
                Settings
              </a>
            </nav>

            {/* Admin Profile */}
            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-bold">
                  S
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    System Administrator
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    NOOR AI SYSTEM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          {/* Top Header */}
          <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-5 py-5 sm:px-8">
              <div>
                <p className="text-sm text-slate-400">
                  Welcome back
                </p>

                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  NOOR AI SYSTEM Dashboard
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 sm:block">
                  🔔 Notifications
                </button>

                <a
                  href="/customers"
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-200"
                >
                  Manage Customers
                </a>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent p-7 shadow-2xl shadow-black/20 sm:p-10">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Intelligent Professional Services
                </div>

                <h3 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  From Service
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                    to Success.
                  </span>
                </h3>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  A centralized intelligent platform for customer management,
                  research services, document generation, data analysis,
                  presentations, translation, and professional business
                  services.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/customers"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
                  >
                    Open Customer Management →
                  </a>

                  <a
                    href="/services"
                    className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Explore Services
                  </a>
                </div>
              </div>
            </section>

            {/* Statistics */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statistics.map((stat) => (
                <div
                  key={stat.title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        {stat.title}
                      </p>

                      <p className="mt-3 text-3xl font-black">
                        {stat.value}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                      {stat.icon}
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    {stat.description}
                  </p>
                </div>
              ))}
            </section>

            {/* Services */}
            <section id="services" className="mt-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                  Professional Services
                </p>

                <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Everything you need in one platform
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                  Choose a service to manage your professional work through
                  the NOOR AI SYSTEM.
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div
                      className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${service.gradient} opacity-10 blur-2xl transition group-hover:opacity-20`}
                    />

                    <div className="relative">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} text-2xl shadow-lg`}
                      >
                        {service.icon}
                      </div>

                      <h4 className="mt-5 text-lg font-bold">
                        {service.title}
                      </h4>

                      <p className="mt-3 min-h-[84px] text-sm leading-6 text-slate-400">
                        {service.description}
                      </p>

                      <a
                        href={
                          service.title === "Documents & Files"
                            ? "/customers"
                            : service.title === "CV & Job Application" ||
                                service.title === "Research & Monograph"
                              ? "/services"
                              : "#"
                        }
                        className="mt-5 inline-flex items-center text-sm font-bold text-white transition hover:text-blue-300"
                      >
                        Open Service
                        <span className="ml-2">→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* System Overview */}
            <section className="mt-12 grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      System Status
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Platform Overview
                    </h3>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    ● System Online
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-black/20 p-4">
                    <p className="text-xs text-slate-500">
                      Backend
                    </p>

                    <p className="mt-2 font-semibold text-emerald-400">
                      Connected
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/20 p-4">
                    <p className="text-xs text-slate-500">
                      Database
                    </p>

                    <p className="mt-2 font-semibold text-emerald-400">
                      Ready
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/20 p-4">
                    <p className="text-xs text-slate-500">
                      AI Engine
                    </p>

                    <p className="mt-2 font-semibold text-amber-400">
                      Preparing
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-6">
                <p className="text-sm font-semibold text-violet-300">
                  NOOR AI SYSTEM
                </p>

                <h3 className="mt-3 text-2xl font-black">
                  From Service to Success.
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Intelligent tools designed to help professional services
                  become faster, smarter, and more organized.
                </p>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-slate-500">
                    Platform
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Noor Professional Online Service
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 border-t border-white/10 py-8 text-center">
              <p className="text-sm text-slate-400">
                Noor — From Service to Success, Always With You
              </p>

              <p className="mt-2 text-xs text-slate-600">
                NOOR AI SYSTEM • Professional Management Platform
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
