import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { GET_LATEST_MESSAGES } from "../schema";
import MessagesList from "../components/MessagesList";
import ReactRouter from "react-router-dom";

const mocks = [
  {
    request: {
      query: GET_LATEST_MESSAGES,
      variables: {
        channelId: "General"
      }
    },
    result: {
      data: {
        MessagesFetchLatest: [
          {
            messageId: "messageId1",
            datetime: "2023-04-03T09:42:57.709Z",
            text: "Hello guys!",
            userId: "Sam"
          }
        ]
      }
    }
  }
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('MessagesList', () => {
  it("renders without error", async () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({
      userId: "Sam",
      channelId: "General"
    });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MessagesList />
      </MockedProvider>
    );
    expect(await screen.findByText("Sam")).toBeInTheDocument();
    expect(await screen.findByText("Hello guys!")).toBeInTheDocument();
  });
});