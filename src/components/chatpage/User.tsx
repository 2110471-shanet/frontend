import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

// username, isOnline, other set staet function...
export default function User() {
    return (
        <div className="w-full bg-white rounded-md outline outline-slate-200 duration-100 hover:outline-slate-400 hover:drop-shadow-sm h-20 shrink-0 flex items-center px-4 gap-2 hover:cursor-pointer">
            <div className="w-6 h-6 relative flex justify-center items-center bg-[#092A5B] rounded-full shrink-0">
                <Person2RoundedIcon sx={{height: "60%", width: "60%", color: "white",}} />
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-full truncate">
                <span className="max-w-full w-full truncate">UserUserUserUserUserUserUserUserUserUserUserUserUserUserUserUserUserUser</span>
                <span className="text-xs text-green-600">Online</span>
            </div>
        </div>
    );
}