/** @jsxImportSource @emotion/react */

import { useApolloClient, useQuery } from "@apollo/client";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useParams } from "react-router-dom";
import Message, { 
  FetchMessagesLatesResponse, 
  FetchMessagesMoreResponse, 
  PostMessageResponse
} from "../models/Message";
import { useEffect, useRef, useState } from "react";
import TextInput from "./TextInput";
import { 
  GET_LATEST_MESSAGES, 
  GET_MORE_MESSAGES, 
  MESSAGE_POST 
} from "../schema";

const MessagesList = () => {
  const client = useApolloClient();
  const { userId, channelId } = useParams();
  const { loading, error, data } = useQuery<FetchMessagesLatesResponse>(
    GET_LATEST_MESSAGES, 
    { variables: { channelId }, }
  );
  const listRef = useRef<HTMLDivElement | null>(null);

  const [isFetchingOld, setIsFetchingOld] = useState(false);
  const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const [isReachedOld, setIsReachedOld] = useState(false);
  const [isFetchingNew, setIsFetchingNew] = useState(false);
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  useEffect(() => {
    setOldMessages([]);
    setNewMessages([]);
    setIsReachedOld(false);
  }, [channelId]);

  if (loading) {
    return (
      <div css={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div css={{ 
        flex: 1, 
        display: 'flex',
        alignItems: 'flex-end', 
        justifyContent: 'center',
        padding: '0 20px'
      }}>
        <Alert variant='secondary' css={{ flex: 1 }}>
        The messages could not be loaded. Please check the internet connection.
      </Alert>
      </div>
    )
  }

  if (data) {
    const latestMessages = data.MessagesFetchLatest.map(
      (message) => new Message(message, true)
    );
    const messages = [
      ...newMessages,
      ...latestMessages, 
      ...oldMessages
    ];

    const fetchOldMessages = async () => {
      setIsFetchingOld(true);
  
      const { data, errors } = await client.query<FetchMessagesMoreResponse>({
        query: GET_MORE_MESSAGES,
        variables: {
          "channelId": channelId,
          "messageId": messages[messages.length - 1].messageId,
          "old": true
        }
      });

      if (!errors) {
        const items = data.MessagesFetchMore.map((message) => new Message(message, true));

        setOldMessages(value => [...value, ...items])
        setIsReachedOld(items.length < 10);
      }
      setIsFetchingOld(false);
    }

    const fetchNewMessages = async () => {
      setIsFetchingNew(true);

      if (messages.length > 0) {
        const { data, errors } = await client.query<FetchMessagesMoreResponse>({
          query: GET_MORE_MESSAGES,
          variables: {
            "channelId": channelId,
            "messageId": messages[0].messageId,
            "old": false
          }
        });
    
        if (!errors) {
          const items = data.MessagesFetchMore
          .map((message) => new Message(message, true))
          .reverse();
  
          setNewMessages(value => [...items, ...value]);
        }
      } else {
        await client.refetchQueries({
          include: ["MessagesFetchLatest"]
        });
      }

      setIsFetchingNew(false);
    }
  
    const handleScroll = (event: React.UIEvent<HTMLElement, UIEvent>) => {
      if (isFetchingOld || isReachedOld) return;

      if (listRef && listRef.current) {
        const scrollTop = listRef.current.scrollTop;
        const scrollHeight = listRef.current.scrollHeight;
        const clientHeight = listRef.current.clientHeight;
        if (clientHeight - scrollHeight === scrollTop) {
          fetchOldMessages();
        }
      }
    }

    const sendMessage = async (text: string) => {
      try {
        const { data } = await client.mutate<PostMessageResponse>({
          mutation: MESSAGE_POST,
          variables: { channelId, userId, text }
        });
        if (data) {
          const message = new Message(data.MessagePost, true);
          setNewMessages((value) => [message, ...value]);
        }
      } catch(error) {
        const date = new Date();
        const message = new Message({
          messageId: date.getTime().toString(),
          userId: userId || '',
          datetime: date.toISOString(),
          text
        }, false);
        setNewMessages((value) => [message, ...value]);
      }
    }

    return <>
      <ListGroup 
        css={{
          position: 'relative',
          flex: '1 1 0',
          flexDirection: 'column-reverse',
          border: '0px !important',
          paddingBottom: '56px',
          overflow: 'auto'
        }}
        ref={listRef}
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <ListGroup.Item
            as="li"
            css={{ border: 0 }}
            key={message.messageId}
          >
            <div css={{ display: 'flex' }}>
              <img 
                src={`/images/${message.userId}.png`} 
                alt="avatar"
                css={{
                  width: '40px',
                  height: '40px',
                  marginRight: '5px'
                }}
                />
              <div 
                className="ms-1 me-auto"
                css={{
                  whiteSpace: 'pre-line'
                }}
              >
                <div css={{ 
                  display: 'flex', 
                  alignItems: 'center'
                }}>
                  <span className="fw-bold">
                    {message.userId}
                  </span>
                  <span css={{ fontSize: '13px' }}>
                    <span css={{ marginLeft: '8px' }}>
                      {message.datetime.toLocaleTimeString().replace(/:\d\d /, ' ')}
                    </span>
                    <span css={{ 
                      marginLeft: '8px', 
                      color: message.isSent ? '#9ec94a' : '#b71e3c' 
                    }}>
                      {message.isSent ? '✓' : '⚠'}
                    </span>
                  </span>
                </div>
                {message.text}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div css={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '40px',
        width: '190px',
        position: 'absolute',
        bottom: '96px',
        background: 'white',
        zIndex: 1,
        borderRadius: '24px',
        left: '50%',
        border: 'var(--bs-card-border-width) solid var(--bs-card-border-color)'
      }}>
        {
          isFetchingNew ? 
          <Spinner variant="primary" size="sm"/> :
          <Button 
            variant="link"
            css={{ textDecoration: 'none' }}
            onClick={(event) => fetchNewMessages()}
          >
            Check new messages
          </Button>
        }
      </div>
      <TextInput onSubmit={text => sendMessage(text)}/>
    </>
  }

  return <></>
}

export default MessagesList;
