interface AuthLayoutProps {
  logo: React.ReactNode;
  children: React.ReactNode;
}

const VehicleLayout = ({ logo, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* LEFT – LOGO */}
        <div className="w-1/2 flex items-center justify-center p-10">
          {logo}
        </div>

        {/* RIGHT – FORM */}
        <div className="w-1/2 flex flex-col justify-center p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default VehicleLayout;
