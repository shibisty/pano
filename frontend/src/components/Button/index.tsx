import React, {ReactNode} from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    href?: string;
    target?: string;
};

export default function Button({
  children,
  onClick,
  className,
  href,
  target,
}: ButtonProps) {
  return (
    href ?
    <Link className={`sidebar-button ${className || ''}`} to={href || "/"} target={target || "_self"} onClick={onClick}>
      {children}
    </Link>
    :
    <a className={`sidebar-button ${className || ''}`} href="#" onClick={onClick} target={target || "_self"}>
      {children}
    </a>
  );
}
