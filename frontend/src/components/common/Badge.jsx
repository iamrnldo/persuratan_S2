export const Badge = ({ children, variant = "info" }) => {
  const variants = {
    success: "badge-success",
    danger: "badge-danger",
    warning: "badge-warning",
    info: "badge-info",
  };

  return <span className={`badge ${variants[variant]}`}>{children}</span>;
};
