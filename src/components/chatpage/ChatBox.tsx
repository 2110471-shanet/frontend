import Messages from "./Messages";
import TextInput from "./TextInput";

export default function ChatBox() {
    return (
        <div className="h-full flex-1 flex flex-col">
            <Messages />
            <TextInput />
        </div>
    );
}