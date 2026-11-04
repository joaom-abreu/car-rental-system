import { Link } from "react-router-dom";
import styles from "./Button.module.css";

const ICON_SIZE = 18;

function Button({ variant = "primary", icon: Icon, to, type = "button", className, children, ...props }) {
  const classes = [styles.button, styles[variant], !children && styles.iconOnly, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {Icon && <Icon size={ICON_SIZE} />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}

export default Button;
