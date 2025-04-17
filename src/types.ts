type GlobalLoadingContextType = {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserType = {
    _id: string,
    username: string,
    status: string,
    unreadCount: number,
}

type UserContextType = {
    username: string;
    userId: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
};

type MembersType = Array<string>;

type GroupType = {
    _id: string,
    chatName: string,
    lastmessage: string,
    members: Array<UserType>,
    numUnread: number,
}

type GroupContextType = {
    isShowingMember: boolean;
    groupName: string;
    members: MembersType;
    setIsShowingMember: React.Dispatch<React.SetStateAction<boolean>>;
    setGroupName: React.Dispatch<React.SetStateAction<string>>;
    setMembers: React.Dispatch<React.SetStateAction<MembersType>>;
};

type ChatSelectionStateContextType = {
    chatSelectionState: string;
    setChatSelectionState: React.Dispatch<React.SetStateAction<string>>;
    selectedChat: string;
    setSelectedChat: React.Dispatch<React.SetStateAction<string>>;
};

type MessageType = {
    sender: {
        _id: string,
        username: string,
    };
    message: string;
};

type MessagesContextType = {
    messages: Array<MessageType>;
    setMessages: React.Dispatch<React.SetStateAction<Array<MessageType>>>;
};

export type { 
    GlobalLoadingContextType, UserContextType, MembersType, GroupContextType, ChatSelectionStateContextType, 
    MessageType, MessagesContextType, UserType, GroupType };