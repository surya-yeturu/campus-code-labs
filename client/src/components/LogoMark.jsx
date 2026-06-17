const LogoMark = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CampusCode Labs"
      role="img"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1DA1FF" />
          <stop offset="100%" stopColor="#005BFF" />
        </linearGradient>

        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* First C */}
      <path
        d="M220 120 A140 140 0 1 0 220 392"
        stroke="url(#blueGradient)"
        strokeWidth="50"
        strokeLinecap="round"
        fill="none"
        filter="url(#shadow)"
      />

      {/* Second C */}
      <path
        d="M300 160 A100 100 0 1 0 300 352"
        stroke="url(#blueGradient)"
        strokeWidth="42"
        strokeLinecap="round"
        fill="none"
        filter="url(#shadow)"
      />

      {/* L */}
      <path
        d="M315 210 V355 H430"
        stroke="#E5E7EB"
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#shadow)"
      />
    </svg>
  );
};

export default LogoMark;

