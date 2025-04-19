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

type UserWithLastMessageType = UserType & {
    lastMessage?: MessageType,
};

type UserContextType = {
    username: string;
    userId: string;
    currentUsername: string
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    setCurrentUsername: React.Dispatch<React.SetStateAction<string>>;
};

type MembersType = Array<string>;

type GroupType = {
    _id: string,
    chatName: string,
    lastMessage: string,
    members: Array<UserType>,
    unreadCount: number,
}

type GroupContextType = {
    isShowingMember: boolean;
    groupName: string;
    members: Array<UserType>;
    setIsShowingMember: React.Dispatch<React.SetStateAction<boolean>>;
    setGroupName: React.Dispatch<React.SetStateAction<string>>;
    setMembers: React.Dispatch<React.SetStateAction<Array<UserType>>>;
};

type ChatSelectionStateContextType = {
    chatSelectionState: string;
    setChatSelectionState: React.Dispatch<React.SetStateAction<string>>;
    selectedChat: string;
    setSelectedChat: React.Dispatch<React.SetStateAction<string>>;
    isSelectedDirectChat: boolean;
    setIsSelectedDirectChat: React.Dispatch<React.SetStateAction<boolean>>;
};

type MessageType = {
    sender: {
        _id: string,
        username: string,
    };
    message: string;
    // createdAt: Date;
};

type MessagesContextType = {
    messages: Array<MessageType>;
    setMessages: React.Dispatch<React.SetStateAction<Array<MessageType>>>;
};

export type { 
    GlobalLoadingContextType, UserContextType, MembersType, 
    GroupContextType, ChatSelectionStateContextType, 
    MessageType, MessagesContextType, UserType, GroupType,
    UserWithLastMessageType,
};