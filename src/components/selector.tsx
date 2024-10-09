"use client";
import { Option } from "@/types/student";
import { useRef, useState } from "react";

export default function Selector({ value, changeValue, options }: { value: Option, changeValue: (option: Option) => void, options: Option[] }) {
    const [showOptions, toggleShowOptions] = useState<boolean>(false);
    const [searchText, changeSearchText] = useState<string>(value.name);
    const myOptions = options.filter(o => o.name.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div className="relative flex flex-col">
            <input value={searchText} onChange={(e) => changeSearchText(e.target.value)} onBlur={() => toggleShowOptions(false)} onFocus={() => toggleShowOptions(true)} placeholder="Select Option" className="font-rubik p-[10px] bg-gray-100 focus:outline focus:outline-1 focus:outline-black" />
            {showOptions &&

                <div className="absolute top-[120%] w-full flex flex-col bg-white drop-shadow-lg border border-gray-100">
                    {myOptions.map(o =>
                        <a className="font-rubik p-[10px] hover:bg-gray-100" key={o.id}>{o.name}</a>
                    )}
                </div>


            }
        </div>
    )
}