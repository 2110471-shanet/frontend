import TestGroupMemberContext from "@/components/testpage/TestGroupMemberContext";
import TestUsernameContext from "@/components/testpage/TestUsernameContext";

export default function TestContext() {
    return (
        <div className="h-screen flex flex-col gap-4 justify-center items-center bg-slate-50">
            <TestUsernameContext />
            <TestGroupMemberContext />
        </div>
    );
}