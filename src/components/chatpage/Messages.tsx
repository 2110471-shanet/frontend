import Message from "./Message";

const mockMessage = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam suscipit non magna nec porta. Integer risus elit, auctor eget massa sed, iaculis placerat augue. Nulla quis tellus et elit lobortis eleifend porttitor in diam. Duis sit amet tellus elementum, efficitur ligula tincidunt, rhoncus magna. Cras faucibus posuere elit vitae eleifend.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam suscipit non magna nec porta. Integer risus elit, auctor eget massa sed, iaculis placerat augue. Nulla quis tellus et elit lobortis eleifend porttitor in diam. Duis sit amet tellus elementum, efficitur ligula tincidunt, rhoncus magna. Cras faucibus posuere elit vitae eleifend.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam suscipit non magna nec porta. Integer risus elit, auctor eget massa sed, iaculis placerat augue. Nulla quis tellus et elit lobortis eleifend porttitor in diam. Duis sit amet tellus elementum, efficitur ligula tincidunt, rhoncus magna. Cras faucibus posuere elit vitae eleifend.`;

export default function Messages() {
    return (
        <div className="flex-1 bg-white bg-cover overflow-auto flex flex-col flex-nowrap gap-4 px-4 py-4 [scrollbar-width:thin]">
            {/* must be variable */}
            <Message isMe={false} sender="SugarRider" message={"Hi there,\npal."} />
            {/* must be back tick in order to newline to work */}
            <Message isMe={false} sender="SugarRider" message={`It's been a long time since the last time we met, huh? What do you think?\nShould we meet up for once?`} />
            <Message isMe={true} sender="" message={`Sounds fun, Sugar!\nCan you meet me at the usual place? I kinda miss the old times. Looking forward to meet ya xx`} />
            <Message isMe={true} sender="" message={mockMessage} />
        </div>
    );
}