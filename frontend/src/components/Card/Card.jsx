import styles from "./Card.module.css";

function Card({ as: Tag = "div", noPadding = false, className, children, ...props }) {
  const classes = [styles.card, noPadding && styles.noPadding, className].filter(Boolean).join(" ");
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}

export default Card;
