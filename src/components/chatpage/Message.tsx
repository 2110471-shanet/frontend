import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

export default function Message({
    isMe,
    senderName,
    message,
}: {
    isMe: boolean,
    senderName: string,
    message: string
}) {
    if (isMe) {
        return (
            <div className="w-full flex justify-end">
                <div className="py-2 px-4 my-2 bg-blue-300 rounded-md w-fit max-w-4/5">
                    {message}
                </div>
            </div>
        );
    } else {
        return (
            <div className="w-full flex items-start">
                <div className="h-8 w-8 relative shrink-0 rounded-full bg-blue-300 flex justify-center items-center">
                    <Person2RoundedIcon sx={{width: "80%", height: "80%", color: "white", }} />
                </div>
                <div className="flex flex-col flex-1 ms-2">
                    <span>{senderName}</span>
                    <div className="max-w-4/5 w-fit py-2 px-4 text-black bg-blue-200 rounded-md">
                        {message}
                    </div>
                </div>
            </div>
        );
    }
}