interface AuthLayoutProps {
  logo: React.ReactNode;
  children: React.ReactNode;
}

const VehicleLayout = ({ logo, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          {logo}
        </div>

        {/* Content */}
        <div className="mt-4">
          {children}
        </div>

      </div>
    </div>
  );
};

export default VehicleLayout;