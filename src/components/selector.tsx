"use client";
import { Option } from "@/types/student";
import { useEffect, useRef, useState } from "react";

export default function Selector({ value, changeValue, options }: { value: { id: string, name: string } | null, changeValue: (option: { id: string, name: string}) => void, options:  { id: string, name: string }[] }) {
    const [showOptions, toggleShowOptions] = useState<boolean>(false);
    const [searchText, changeSearchText] = useState<string | undefined>(value?.name);
    const myOptions = options.filter(o => o.name.toLowerCase().includes(searchText?.toLowerCase() ?? ""));

    useEffect(() => {
        changeSearchText(value?.name);
    }, [value]);

    return (
        <div className="relative flex flex-1 flex-col">
            <input value={searchText} onChange={(e) => changeSearchText(e.target.value)} onFocus={() => toggleShowOptions(true)} placeholder="Select Option" className="font-rubik p-[10px] bg-gray-100 focus:outline focus:outline-1 focus:outline-black" />
            {showOptions &&

                <div className="absolute top-[120%] max-h-[450px] overflow-y-auto w-full flex flex-col bg-white drop-shadow-lg border border-gray-100">
                    {myOptions.map(o =>
                        <a className="font-rubik p-[10px] hover:bg-gray-100" onClick={() => {
                            changeValue(o);
                            toggleShowOptions(false);
                        }} key={o.id}>{o.name}</a>
                    )}
                </div>


            }
        </div>
    )
}