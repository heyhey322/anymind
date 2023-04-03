export type FetchMessagesLatesResponse = {
  MessagesFetchLatest: MessageData[]
}

export type FetchMessagesMoreResponse = {
  MessagesFetchMore: MessageData[]
}

export type PostMessageResponse = {
  MessagePost: MessageData
}

export type MessageData = {
  messageId: string;
  userId: string;
  text: string;
  datetime: string;
}

export default class Message {
  messageId: string;
  userId: string;
  text: string;
  datetime: Date;
  isSent: boolean

  constructor(data: MessageData, isSent: boolean) {
    this.messageId = data.messageId;
    this.userId = data.userId;
    this.text = data.text;
    this.datetime = new Date(data.datetime);
    this.isSent = isSent;
  }
}