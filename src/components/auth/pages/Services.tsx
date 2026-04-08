import {
  Wrench,
  Droplets,
  Disc,
  Gauge,
  Battery,
  Wind,
  Zap,
  Paintbrush,
  Search,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Services = () => {
  const services = [
    {
      title: "Oil & Filter",
      desc: "Crucial for engine health.",
      icon: <Droplets className="text-blue-500" />,
      demand: 85,
    },
    {
      title: "Tire Services",
      desc: "Rotation, balancing, alignment.",
      icon: <Disc className="text-gray-600" />,
      demand: 65,
    },
    {
      title: "Brake Service",
      desc: "Inspection and replacement.",
      icon: <Wrench className="text-red-500" />,
      demand: 45,
    },
    {
      title: "Fluid Top-Ups",
      desc: "Coolant, brake, and washer fluids.",
      icon: <Activity className="text-cyan-500" />,
      demand: 30,
    },
    {
      title: "Battery Service",
      desc: "Testing and replacing batteries.",
      icon: <Battery className="text-orange-500" />,
      demand: 25,
    },
    {
      title: "Air Filters",
      desc: "Engine and cabin air quality.",
      icon: <Wind className="text-green-500" />,
      demand: 55,
    },
    {
      title: "Car AC Service",
      desc: "Cleaning and recharging.",
      icon: <Zap className="text-yellow-500" />,
      demand: 40,
    },
    {
      title: "Electrical Repairs",
      desc: "Alternator and lighting.",
      icon: <Zap className="text-purple-500" />,
      demand: 20,
    },
    {
      title: "Denting & Paint",
      desc: "Exterior repairs and rust.",
      icon: <Paintbrush className="text-pink-500" />,
      demand: 15,
    },
    {
      title: "Diagnostics",
      desc: "ECU error code scanning.",
      icon: <Search className="text-indigo-500" />,
      demand: 50,
    },
  ];

  // Colors for the chart
  const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Service Dashboard <span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Overview of maintenance services and analytics.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Total Services</p>
          <h2 className="text-xl font-bold">10</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Top Service</p>
          <h2 className="text-xl font-bold">Oil & Filter</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Avg Demand</p>
          <h2 className="text-xl font-bold">52%</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Status</p>
          <h2 className="text-green-600 font-bold">Active</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics Chart */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Service Popularity
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={services.slice(0, 5)}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis dataKey="title" hide />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="demand" radius={[6, 6, 6, 6]}>
                    {services.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Real-time data based on monthly service requests.
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Monthly Jobs
                </p>
                <h4 className="text-3xl font-bold mt-1">1,284</h4>
              </div>
              <div className="bg-blue-500/30 p-2 rounded-xl">
                <Gauge size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Service Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-md font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
