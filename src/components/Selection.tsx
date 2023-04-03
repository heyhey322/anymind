/** @jsxImportSource @emotion/react */

import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { users, channels } from '../data';

const Selection = () => {
  const { userId, channelId } = useParams();
  const navigate = useNavigate();
  
  return (
    <Form css={{ 
      padding: '15px', 
      width: '260px',
      borderRight: 'var(--bs-card-border-width) solid var(--bs-card-border-color)'
    }}>
      <Form.Group className="mb-3">
        <Form.Label>Choose your user</Form.Label>
        <Form.Select 
          aria-label="Select user"
          value={userId}
          onChange={(event) => navigate(`/${event.target.value}/${channelId}`)}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Choose your channel</Form.Label>
        <ListGroup defaultActiveKey={channelId}>
          {channels.map((channel) => (
            <ListGroup.Item
              key={channel.id}
              action
              href={channel.id}
              onClick={(event) => {
                event.preventDefault();
                navigate(`/${userId}/${channel.id}`)
              }}
            >
              {channel.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Form.Group>
    </Form>
  )
}

export default Selection;
