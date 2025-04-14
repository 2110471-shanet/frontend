import Message from "./Message";

export default function Messages() {
    return (
        <div className="flex-1 bg-white bg-cover overflow-auto flex flex-col flex-nowrap gap-4 px-4 py-4 [scrollbar-width:thin]">
            <Message isMe={true} sender="" message="Hello, my friends" />
            <Message isMe={false} sender="SugarRider" message="Hi there, pal." />
            <Message isMe={false} sender="SugarRider" message="It's been a long time since the last time we met, huh? What do you think? Should we meet up for once?" />
            <Message isMe={true} sender="" message="Sounds fun, Sugar! Can you meet me at the usual place? I kinda miss the old times. Looking forward to meet ya xx" />
            <Message isMe={false} sender="SugarRider" message="Hi there, pal." />
            <Message isMe={false} sender="SugarRider" message="It's been a long time since the last time we met, huh? What do you think? Should we meet up for once?" />
            <Message isMe={true} sender="" message="Sounds fun, Sugar! Can you meet me at the usual place? I kinda miss the old times. Looking forward to meet ya xx" />
            <Message isMe={false} sender="SugarRider" message="Hi there, pal." />
            <Message isMe={false} sender="SugarRider" message="It's been a long time since the last time we met, huh? What do you think? Should we meet up for once?" />
            <Message isMe={true} sender="" message="Sounds fun, Sugar! Can you meet me at the usual place? I kinda miss the old times. Looking forward to meet ya xx" />
            <Message isMe={false} sender="SugarRider" message="Hi there, pal." />
            <Message isMe={false} sender="SugarRider" message="It's been a long time since the last time we met, huh? What do you think? Should we meet up for once?" />
            <Message isMe={true} sender="" message="Sounds fun, Sugar! Can you meet me at the usual place? I kinda miss the old times. Looking forward to meet ya xx" />
        </div>
    );
}