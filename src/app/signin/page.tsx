import AuthPane from "@/components/authpage/AuthPane";

export default function SignIn() {
    return (
        <div className="bg-slate-50 min-h-[100dvh] flex justify-center items-center flex-nowrap px-4">
            <AuthPane isSignUp={false} />
        </div>
    );
}