/** @jsxImportSource @emotion/react */

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

type TextInputProps = {
  onSubmit: (text: string) => void
}

const TextInput = (props: TextInputProps) => {
  const { channelId } = useParams();
  
  const [text, setText] = useState(localStorage.getItem(channelId || '') || '');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    if (channelId) {
      localStorage.setItem(channelId, event.target.value);
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      handleSubmit();
    }
  }

  const handleSubmit = () => {
    if (text === '') return;

    props.onSubmit(text);
    setText('');
    if (channelId) {
      localStorage.setItem(channelId, '');
    }
  }
  
  return (
    <InputGroup 
      css={{ 
        margin: '0 20px 20px 20px', 
        width: 'initial' }
      }
    >
      <Form.Control
        placeholder="Message to channel"
        aria-label="text"
        aria-describedby="basic-addon2"
        as="textarea" 
        css={{ resize: 'none' }}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />
      <Button 
        variant="outline-secondary" 
        id="button-addon2"
        onClick={(event) => handleSubmit()}
      >
        Send
      </Button>
    </InputGroup>
  )
};

export default TextInput;
