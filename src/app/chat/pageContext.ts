import { createContext, useContext } from "react";
import type { ChatSelectionStateContextType, MessagesContextType } from "@/types";

const ChatSelectionStateContext = createContext<ChatSelectionStateContextType | undefined>(undefined);
export function useChatSelectionState() {
    const context = useContext(ChatSelectionStateContext);
    if (!context) throw new Error("useChatSelectionState must be used in /chat.");
    return context;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);
export function useMessages() {
    const context = useContext(MessagesContext);
    if (!context) throw new Error("useMessages must be used in /chat.");
    return context;
}

export { ChatSelectionStateContext, MessagesContext };