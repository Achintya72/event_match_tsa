import classes from "@/utils/classes"

interface LoaderProps {
    inline?: boolean
}

export default function Loader({ inline = false} : LoaderProps) {
    return (
        <div className={classes("w-full flex items-center justify-center", inline ? "" : "min-h-screen")}>
            <div className="loader w-[50px] h-[50px] bg-black" />
        </div>
    )
}