"use client";

import { useStudent } from "@/backend/hook";
import { FieldValues, useForm } from "react-hook-form";
import Input from "./input";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Qual, Option } from "@/types/student";
import Selector from "./selector";
import DataContext from "@/backend/datacontext";
import Button from "./button";
import { CompEvent } from "@/types/event";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/backend/firebase";

interface OnboardingForm extends FieldValues {
    name: string,
    grade: number
}


export default function OnboardingModal() {
    const [student] = useStudent();
    const { events } = useContext(DataContext);
    const [quals, changeQuals] = useState<Qual[]>(student?.priorQuals ?? []);
    const [error, changeError] = useState<string>("");
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

    const onSubmit = (values: OnboardingForm) => {
        console.log("Submitting")
        let noErrors = true;
        quals.forEach(q => {
            const eventForQ = (events ?? []).find(e => e.id === q.eventId);
            console.log(q);
            if (eventForQ == undefined) {
                changeError("Something went wrong. Try again later");
                noErrors = false;
            } else if (q.placement <= 0) {
                changeError("We need placement for: " + eventForQ.name);
                noErrors = false;

            } else if (q.placement > 10) {
                changeError("We are only looking for top 10 placements");
                noErrors = false;
            }
        });
        if (noErrors) {
            setDoc(doc(db, "students", student.uid), {
                name: values.name,
                grade: values.grade,
                onboarded: true,
                priorQuals: quals.map(q => ({ level: q.level, placement: q.placement, eventId: q.eventId }))
            }, { merge: true });
        }

    }

    console.log(error);
    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white min-w-[500px] p-[40px] flex flex-col gap-[12px]">
                <h1 className="font-rubik text-4xl font-semibold">Basic Info</h1>
                <Input<OnboardingForm>
                    label="name"
                    name="name"
                    error={errors.name}
                    register={register}
                    placeholder="John Doe"
                    options={{
                        required: "Required",
                        minLength: { value: 1, message: "We need your name!" }
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
                <QualForm
                    quals={quals}
                    changeQuals={changeQuals}
                />
                <Button>Save</Button>
                {error.length > 0 && <p className="font-rubik text-red-600">{error}</p>}
            </form>
        </div>
    );
}

const QualForm = ({ quals, changeQuals }: { quals: Qual[], changeQuals: Dispatch<SetStateAction<Qual[]>> }) => {
    const { events } = useContext(DataContext);
    return (
        <div className="flex flex-col items-stretch">
            <div className="flex justify-between items-center">
                <label className="font-rubik font-light tracking-widest uppercase text-sm text-white-extraDark">Prior Qualifications (HS Only)</label>
                <a onClick={() => {
                    let newQuals: Qual[] = [...quals, { level: "State", eventId: (events && events[0].id) ?? "0", placement: 1 } as Qual]
                    changeQuals([...newQuals]);
                }}>+</a>
            </div>
            {quals.map((q, i) => {
                let eventForQual = (events ?? []).find(e => e.id === q.eventId) ?? null;
                return <div key={i} className="flex gap-[10px] mb-[10px]">
                    <div className="p-[10px] cursor-pointer uppercase bg-gray-500 font-rubik text-white" onClick={() => {
                        let newLevel: "National" | "State" = q.level == "National" ? "State" : "National"
                        changeQuals(prev => {
                            prev[i].level = newLevel;
                            return [...prev];
                        })
                    }}>
                        {q.level.substring(0, 2)}
                    </div>
                    <Selector
                        value={eventForQual != null ? { name: eventForQual.name, id: eventForQual.id } : null}
                        changeValue={newQ => {
                            console.log(newQ);
                            let newEventFromQ: CompEvent | null = (events ?? []).find(e => e.id === newQ.id) ?? null;
                            if (newEventFromQ != null) {
                                changeQuals((prev) => {
                                    prev[i] = { level: prev[i].level, placement: prev[i].placement, eventId: newEventFromQ.id, ...newEventFromQ };
                                    return [...prev];
                                })

                            }
                        }}
                        options={events ?? []}
                    />
                    <input className="max-w-[50px] px-[10px] font-rubik bg-gray-100" value={q.placement == -1 ? "" : q.placement} onChange={(e) => {
                        if (e.target.value.length == 0 || /^\d+$/.test(e.target.value)) {
                            changeQuals(prev => {
                                prev[i].placement = e.target.value.length == 0 ? -1 : parseInt(e.target.value);
                                return [...prev];
                            })
                        }
                    }} />
                    <Button onClick={() => {
                        console.log("Deleting");
                        changeQuals(prev => {
                            let newQuals = prev.filter((p, k) => k != i);
                            return [...newQuals]
                        })
                    }} type="button">🗑️</Button>
                </div>
            })}
        </div>
    )
}