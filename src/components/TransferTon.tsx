import { useState } from "react";
import { Address, toNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";

const useSafeState = (initialState: string | null) => {
  return useState(initialState ? initialState : '')
}

export function TransferTon() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const amountArg = params.get('amount');
  const streamerArg = params.get('streamer');
  const usernameArg = params.get('username');
  const messageArg = params.get('message');

  const { sender, connected } = useTonConnect();
  const [tonAmount, setTonAmount] = useSafeState(amountArg);
  const [address, setAddress] = useSafeState(streamerArg);

  const [username, setUsername] = useSafeState(usernameArg);
  const [message, setMessage] = useSafeState(messageArg);

  const isValidAmount = () => {
    const n = parseFloat(tonAmount);
    return !Number.isNaN(n) && parseFloat(tonAmount) >= 0.01;
  };

  //Address.isAddress() don't work, so using TonWeb's solution https://github.com/toncenter/tonweb/blob/master/src/utils/Address.js
  const isValidAddress = () => {
    try {
      Address.parse(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <Card>
      <FlexBoxCol>
        <h3>Don't hate and donate</h3>

        <FlexBoxRow>
          <label style={{ minWidth: 80 }}>
            Tons </label>
          <Input
            type="number"
            value={tonAmount}
            onChange={(e) => setTonAmount(e.target.value)}
            placeholder="1 TON"
          ></Input>
        </FlexBoxRow>

        <FlexBoxRow>
          <label style={{ minWidth: 80 }}>
            Address </label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU"
          ></Input>
        </FlexBoxRow>

        <FlexBoxRow>
          <label style={{ minWidth: 80 }}>
            Name </label>
          <Input
            type=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Anon"
          ></Input>
        </FlexBoxRow>

        <FlexBoxRow>
          <label style={{ minWidth: 80 }}>
            Message </label>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="I'm on stream, lol"
          ></Input>
        </FlexBoxRow>

        <Button
          disabled={!connected || !isValidAmount() || !isValidAddress()}
          style={{ marginTop: 18 }}
          onClick={async () => {
            sender.send({
              username: username,
              message: message,
              to: Address.parse(address),
              value: toNano(tonAmount),
            });
          }}
        >
          Transfer
        </Button>
      </FlexBoxCol>
    </Card >
  );
}
