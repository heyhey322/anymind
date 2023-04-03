/** @jsxImportSource @emotion/react */

import Card from "react-bootstrap/Card";
import Layout from "./Layout";
import Selection from './Selection';
import MessagesList from "./MessagesList";

const Chat = () => {
  return (
    <Layout>
      <h5>1 day chat App</h5>
      <p>All messages will be deleted at every 00:00 UTC</p>
      <Card css={{ flex: 1, flexDirection: 'row', alignItems: 'stretch' }}>
        <Selection />
        <div css={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <MessagesList />
        </div>
      </Card>
    </Layout>
  )
}

export default Chat;
