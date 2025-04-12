import ChangeNameMobile from "./ChangeNameMobile"

export default function ChatSelect({
    isChatSelectionShown,
}: {
    isChatSelectionShown: boolean,
}) {
    return (
        <div className={`flex-nowrap h-full flex flex-col absolute lg:relative lg:flex-row z-30 duration-150 lg:duration-0 outline-1 outline-slate-300 lg:outline-none ${(isChatSelectionShown) ? "left-0": "left-[-15rem] lg:left-0"}`}>
            <ChangeNameMobile />
            <div className="flex-1 lg:flex-none min-h-[300px] lg:h-full w-60 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300">

            </div>
            <div className="flex-1 lg:flex-none min-h-[300px] lg:h-full w-60 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300">

            </div>
        </div>
    );
}