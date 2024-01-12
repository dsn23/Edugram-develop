export interface ChatModel {
    _id: string;
    messages: Message[];
    student: ChatUserModel;
    tutor: ChatUserModel;
}

export interface Message {
    message: string;
    sender: string;
    dateTime: string;
}

export interface ChatUserModel {
    _id: string;
    firstName: string;
}
