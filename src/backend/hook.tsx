"use client";

import { useContext } from "react";
import DataContext from "./datacontext";

const useStudent = () => {
    const { students, authUser } = useContext(DataContext);
    let stu = (students ?? []).find(s => s.uid == (authUser?.uid ?? ""));
    return [stu];
}


export {
    useStudent
};