import { Car } from "lucide-react";
import styles from "./Logo.module.css";

const ICON_SIZE = 22;

function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.mark}>
        <Car size={ICON_SIZE} />
      </span>
      <span className={styles.name}>
        Aluguel de <span className={styles.highlight}>Carros</span>
      </span>
    </span>
  );
}

export default Logo;
