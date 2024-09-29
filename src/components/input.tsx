
import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import classes from "@/utils/classes";
import { ReactNode } from "react";

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
    label: Path<T>,
    register: UseFormRegister<T>,
    error: FieldError | undefined,
    options?: RegisterOptions<T, Path<T>>,
    grow?: boolean,
}

const Input = <T extends FieldValues,>({ label, register, grow, options, error, name, className, ...props }: InputProps<T>) => {
    return (
        <div className={classes("flex flex-col items-stretch ", grow ? "flex-1" : "")}>
            <label htmlFor={label} className="font-rubik font-light tracking-widest uppercase text-sm text-white-extraDark">{label}</label>
            <div
                className={
                    classes(
                        "bg-gray-100 flex items-center focus-within:outline focus-within:outline-1",
                        "focus-within:outline-white-black gap-[10px] p-[10px] bg-white-medium",
                        error ? "outline outline-1 outline-red-600" : ""
                    )}>
                <input
                    id={label}
                    {...props}
                    {...register(label, options ?? {})}
                    className={
                        classes(
                            className ?? "",
                            "font-rubik border-none bg-white-medium fill-none",
                            "focus:outline-none",
                            "bg-transparent",
                            "flex-1",
                        )
                    }
                />
            </div>
            {error && <small className="font-rubik text-red-600">{error.message}</small>}
        </div>
    )
}

export default Input;