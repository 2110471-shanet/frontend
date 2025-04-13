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
            <div className="flex-1 lg:flex-none min-h-[50px] lg:h-full w-64 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300 flex flex-col flex-nowrap items-center">
                <span className="shrink-0 w-full text-center py-1 outline outline-slate-200">Online</span>
                <div className="flex-1 w-full px-4 py-4 gap-4 flex flex-col flex-nowrap overflow-auto [scrollbar-width:none] md:[scrollbar-width:thin]">
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                    <div className="w-full h-20 bg-yellow-100 shrink-0"></div>
                </div>
            </div>
            <div className="flex-1 lg:flex-none min-h-[50px] lg:h-full w-64 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300 flex flex-col flex-nowrap items-center">
                <span className="shrink-0 w-full text-center py-1 outline outline-slate-200">Groups</span>
                <div className="flex-1 w-full px-4 py-4 gap-4 flex flex-col flex-nowrap overflow-auto [scrollbar-width:none] md:[scrollbar-width:thin]">
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                    <div className="w-full h-20 bg-green-100 shrink-0"></div>
                </div>
            </div>
            <LinkGroup />
        </div>
    );
}