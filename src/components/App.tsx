import { 
  Routes, 
  Route,
  Navigate 
} from 'react-router-dom';
import Chat from './Chat';
import { users, channels } from '../data';

const App = () => {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to={`/${users[0].name}/${channels[0].id}`} />} 
      />
      <Route path="/:userId/:channelId" element={<Chat />} />
    </Routes>
  );
}

export default App;
