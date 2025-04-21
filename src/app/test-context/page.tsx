import TestGroupContext from "@/components/testpage/TestGroupContext";
import TestUsernameContext from "@/components/testpage/TestUsernameContext";

export default function TestContext() {
    return (
        <div className="h-[100dvh] flex flex-col gap-4 justify-center items-center bg-slate-50">
            <TestUsernameContext />
            <TestGroupContext />
        </div>
    );
}