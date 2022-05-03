import React from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

type IProps = {
  onChange: (value: string) => void;
};

export default function SelectMove(props: IProps) {
  return (
    <FormControl isRequired>
      <FormLabel htmlFor="move">Move</FormLabel>
      <Select
        id="move"
        placeholder="Select movement"
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="1">Rock</option>
        <option value="2">Paper</option>
        <option value="3">Scissors</option>
        <option value="4">Spock</option>
        <option value="5">Lizard</option>
      </Select>
    </FormControl>
  );
}
