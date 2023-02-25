import { useState } from "react";
import styled from "styled-components";
import { Address, toNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";

export function TransferTon() {
  const { sender, connected } = useTonConnect();

  const [tonAmount, setTonAmount] = useState("0.01");
  const [streamerAddress, setTonRecipient] = useState(
    "EQA5SlUJ_a3RAvfC8jlIoYKUF_Ltft5Pd-Q0TrOES2dYcWF9"
  );

  return (
    <Card>
      <FlexBoxCol>
        <h3>Donate to streamers in crypto</h3>
        <FlexBoxRow>
          <label>TON Coins </label>
          <Input
            style={{ marginRight: 8 }}
            type="number"
            value={tonAmount}
            onChange={(e) => setTonAmount(e.target.value)}
          ></Input>
        </FlexBoxRow>
        <FlexBoxRow>
          <label>TON Address </label>
          <Input
            style={{ marginRight: 8 }}
            value={streamerAddress}
            onChange={(e) => setTonRecipient(e.target.value)}
          ></Input>
        </FlexBoxRow>
        <Button
          disabled={!connected}
          style={{ marginTop: 18 }}
          onClick={async () => {
            sender.send({
              to: Address.parse(streamerAddress),
              value: toNano(tonAmount),
            });
          }}
        >
          Transfer
        </Button>
      </FlexBoxCol>
    </Card>
  );
}
