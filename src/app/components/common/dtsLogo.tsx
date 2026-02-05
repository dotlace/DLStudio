export default function DTSLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="flex flex-col items-center">
        {/* Logo Icon - You can customize this */}
        <div className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <svg
            className="h-8 w-8 text-white sm:h-10 sm:w-10 transition-colors duration-300 group-hover:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            />
          </svg>
        </div>
      </div>
      {/* Company Name */}
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-gray-300 sm:text-xl md:text-2xl">
          DotLace
        </span>
        <span className="text-xs font-medium text-gray-300 transition-colors duration-300 group-hover:text-gray-400 sm:text-sm md:text-base">
          Studio
        </span>
      </div>
    </div>
  );
}
