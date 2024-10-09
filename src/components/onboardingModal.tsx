"use client";

import { useStudent } from "@/backend/hook";
import { FieldValues, useForm } from "react-hook-form";
import Input from "./input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Qual } from "@/types/student";
import Selector from "./selector";

interface OnboardingForm extends FieldValues {
    name: string,
    grade: number
}


export default function OnboardingModal() {
    const [student] = useStudent();
    const [quals, changeQuals] = useState<Qual[]>(student?.priorQuals ?? []);
    const { register, handleSubmit, formState: { errors } } = useForm<OnboardingForm>({
        mode: "all",
        reValidateMode: "onBlur",
        defaultValues: {
            name: student?.name ?? "",
            grade: student?.grade ?? 9
        }
    });

    useEffect(() => {
        changeQuals(student?.priorQuals ?? []);
    }, [student]);


    if (student == undefined) {
        return <h1 className="font-rubik text-4xl">Your Profile Doesn't Exist</h1>
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="bg-white min-w-[500px] p-[40px] flex flex-col gap-[12px]">
                <h1 className="font-rubik text-4xl font-semibold">Basic Info</h1>
                <Input<OnboardingForm>
                    label="name"
                    name="name"
                    error={errors.name}
                    register={register}
                    placeholder="John Doe"
                    options={{
                        required: "Required",
                    }}
                />
                <Input<OnboardingForm>
                    label="grade"
                    name="grade"
                    error={errors.grade}
                    register={register}
                    placeholder="9"
                    type="number"
                    options={{
                        required: "Required",
                        min: { value: 9, message: "Must atleast be a freshman" },
                        max: { value: 12, message: "Cannot be older than a senior" }
                    }}
                />
                <div>
                    <label className="font-rubik font-light tracking-widest uppercase text-sm text-white-extraDark">Prior Qualifications (HS Only)</label>
                </div>
                <Selector value={{ name: "Hello", id: "0"}} changeValue={(option) => console.log(option)} options={[
                    {name: "Hello", id: "0"},
                    {name: "Bye", id: "1"}
                ]} />
            </div>
        </div>
    );
}

const QualForm = ({ qual, changeQuals }: { qual: Qual, changeQuals: Dispatch<SetStateAction<Qual[]>>}) => {
    return (
        <div>
            
        </div>
    )
}