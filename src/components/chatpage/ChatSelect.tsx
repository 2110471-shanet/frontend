import ChangeNameMobile from "./ChangeNameMobile"
import LinkGroup from "./LinkGroup";

export default function ChatSelect({
    isChatSelectionShown,
}: {
    isChatSelectionShown: boolean,
}) {
    return (
        <div className={`flex-nowrap h-full flex flex-col absolute lg:relative lg:flex-row z-30 duration-150 lg:duration-0 outline-1 outline-slate-300 lg:outline-none ${(isChatSelectionShown) ? "left-0": "left-[-16rem] lg:left-0"}`}>
            <ChangeNameMobile isChatSelectionShown={isChatSelectionShown} />
            <div className="flex-1 lg:flex-none min-h-[250px] lg:h-full w-64 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300">

            </div>
            <div className="flex-1 lg:flex-none min-h-[250px] lg:h-full w-64 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300">

            </div>
            <LinkGroup />
        </div>
    );
}