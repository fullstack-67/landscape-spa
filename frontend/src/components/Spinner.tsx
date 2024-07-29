import { FC } from "react";
import styles from "./spinner.module.css";
import useStore from "../utils/store";

export const Spinner: FC = () => {
  const [pending] = useStore((state) => [state.pending]);
  if (!pending) return <></>;
  return (
    <div className={styles["spinner-wrapper"]}>
      <div className={styles["lds-dual-ring"]}></div>
    </div>
  );
};
