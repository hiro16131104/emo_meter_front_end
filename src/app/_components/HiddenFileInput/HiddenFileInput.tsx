import React from "react";
import styles from "./HiddenFileInput.module.scss";

interface Props {
  id?: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function HiddenFileInput({
  id,
  name,
  accept,
  multiple,
  onChange,
}: Props): React.ReactElement {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (!onChange) return;
    event.preventDefault();
    onChange(event);
  };

  return (
    <input
      type="file"
      id={id}
      name={name}
      className={`${styles["file-input"]}`}
      accept={accept}
      multiple={multiple}
      onChange={handleInputChange}
    />
  );
}
