import { gql } from "@apollo/client";

export const GET_LATEST_MESSAGES = gql`
  query MessagesFetchLatest($channelId: ChannelId!) {
    MessagesFetchLatest(channelId: $channelId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

export const GET_MORE_MESSAGES = gql`
  query MessagesFetchMore(
    $channelId: ChannelId!
    $messageId: String!
    $old: Boolean!
  ) {
    MessagesFetchMore(
      channelId: $channelId
      messageId: $messageId
      old: $old
    ) {
      messageId
      text
      datetime
      userId
    }
  }
`;

export const MESSAGE_POST = gql`
  mutation MessagePost(
    $channelId: ChannelId!
    $text: String!
    $userId: UserId!
  ) {
      MessagePost(
        channelId: $channelId
        text: $text
        userId: $userId
      ) {
        messageId
        text
        datetime
        userId
      }
  }
`;