import User from "./models/User";
import Channel from "./models/Channel";

export const users = [
  new User('Joyse', 'Joyse'),
  new User('Sam', 'Sam'),
  new User('Russell', 'Russell'),
];

export const channels = [
  new Channel('General', 'General Channel'),
  new Channel('Technology', 'Technology Channel'),
  new Channel('LGTM', 'LGTM Channel'),
];
