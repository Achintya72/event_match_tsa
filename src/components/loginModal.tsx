"use client";

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "./button";
import classes from "@/utils/classes";
import { FieldValues, useForm } from "react-hook-form";
import Input from "./input";
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/backend/firebase";
import { Student } from "@/types/student";
import { doc, setDoc } from "firebase/firestore";

interface LoginForm extends FieldValues {
    email: string,
    password: string
}

interface ModeProps {
    changeMode: Dispatch<SetStateAction<"login" | "signUp">>
}

function LoginModal() {
    const [mode, changeMode] = useState<"login" | "signUp">("login");

    return (
        <div className="fixed inset-0 flex items-center justify-center  z-50" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="bg-white min-w-[500px] p-[40px]">
                {mode == "login" ?
                    <Login changeMode={changeMode} /> : <SignUp changeMode={changeMode}/>
                }
            </div>
        </div>
    )
}

function Login({ changeMode }: ModeProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        mode: "all",
        reValidateMode: "onBlur"
    });

    const onSubmit = async (values: LoginForm) => {
        try {
            let user = await signInWithEmailAndPassword(auth, values.email, values.password);
        } catch(err) {
            window.alert(err);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[12px]">
            <h1 className="text-4xl font-rubik font-semibold">Log In</h1>
            <Input<LoginForm>
                label="email"
                error={errors.email}
                register={register}
                placeholder="1111111@lwsd.org"
                options={{
                    required: "Required Field",
                    pattern: { value: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/, message: "Invalid Email Format" }
                }}
            />
            <Input<LoginForm>
                label="password"
                type="password"
                error={errors.password}
                register={register}
                placeholder="•••••••••"
                options={{
                    required: "Required Field",
                    minLength: { value: 5, message: "Password must be at least 5 characters" }
                }}
            />
            <Button type="submit">Submit</Button>
            <a onClick={() => changeMode("signUp")} className="cursor-pointer text-center text-gray-400 font-rubik font-semibold">Create Account</a>
        </form>
    )
}

interface SignUpForm extends FieldValues {
    email: string,
    password: string,
    "confirm password": string
}

function SignUp({ changeMode }: ModeProps ) {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
        mode: "all",
        reValidateMode: "onBlur"
    });

    const onSubmit = async (values: SignUpForm) =>  {
        try {
            let user = await createUserWithEmailAndPassword(auth, values.email, values.password);
            let userObj: Student = {
                uid: user.user.uid,
                name: values.email,
                grade: 9,
                email: values.email,
                priorQuals: [],
                teams: []
            };
            await setDoc(doc(db, "students", user.user.uid), {
                ...userObj
            }, {merge: true});
        } catch(err) {
            window.alert(err);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[12px]">
            <h1 className="text-4xl font-rubik font-semibold">Sign Up</h1>
            <Input<SignUpForm>
                label="email"
                error={errors.email}
                register={register}
                placeholder="1111111@lwsd.org"
                options={{
                    required: "Required Field",
                    pattern: { value: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/, message: "Invalid Email Format" }
                }}
            />
            <Input<SignUpForm>
                label="password"
                type="password"
                error={errors.password}
                register={register}
                placeholder="•••••••••"
                options={{
                    required: "Required Field",
                    validate: (value: string) => {
                        if (value.length < 6) {
                            return "Password must be atleast 6 characters long"
                        }
                        let chars = Array.from(value);
                        if (!chars.some(char => /[A-Z]/.test(char))) return "Password must have at least one uppercase letter";
                        if (!chars.some(char => /[a-z]/.test(char))) return "Password must have at least one lowercase letter";
                        if (!chars.some(char => /[1-9]/.test(char))) return "Password must have atleast one numerical digit";
                        if (!chars.some(char => /[!@#$%^&*(),.?":{}|<>]/.test(char))) return "Password must have atleast one of [!@#$%^&*(),.?\":{}|<>]";
                    }
                }}
            />
            <Input<SignUpForm>
                label="confirm password"
                type="password"
                error={errors["confirm password"]}
                register={register}
                placeholder="•••••••••"
                options={{
                    required: "Required Field",
                    validate: (val: string, formValues) => {
                        if (val !== formValues.password) return "Passwords must match"
                    }
                }}
            />
            <Button type="submit">Submit</Button>
            <a onClick={() => changeMode("login")} className="cursor-pointer text-center text-gray-400 font-rubik font-semibold">Existing Account</a>

        </form>
    )
}

export { LoginModal };