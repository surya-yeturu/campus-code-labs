const LogoMark = ({ size = 40, className = '' }) => {
  return (
    <img
      src="/assets/ccl-logo-sticker.png"
      width={Math.round(size * 1.32)}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: Math.round(size * 1.32), height: size }}
      alt="Campus Code Labs"
      loading="eager"
      decoding="async"
    />
  );
};

export default LogoMark;
