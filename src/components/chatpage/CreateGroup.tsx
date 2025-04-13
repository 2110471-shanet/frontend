import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

export default function CreateGroup() {
    return (
        <div className="w-full bg-white rounded-md outline outline-slate-200 duration-100 hover:outline-slate-400 hover:drop-shadow-sm h-20 shrink-0 flex justify-center items-center hover:cursor-pointer group">
            <AddCircleOutlineRoundedIcon className="opacity-40 duration-100 group-hover:opacity-60" sx={{height: "2rem", width: "2rem"}} />
        </div>
    );
}