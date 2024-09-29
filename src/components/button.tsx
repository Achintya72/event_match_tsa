"use client";

import classes from "@/utils/classes";
import { ButtonHTMLAttributes } from "react";


export default function Button({ onClick, className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} onClick={onClick} className={classes(className ?? "", " font-semibold font-rubik outline-none px-[16px] py-[8px] bg-black text-white")}>
            {children}
        </button>
    )
}