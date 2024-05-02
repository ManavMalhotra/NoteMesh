import React from "react";

import { Popover, Text, Button } from "@radix-ui/themes";
import { IoMdSettings } from "react-icons/io";

const PopoverBtn = ({ children }) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">
          <IoMdSettings />
          Settings
        </Button>
      </Popover.Trigger>
      <Popover.Content size="1" maxWidth="300px">
        <button className="btn">Logout</button>
      </Popover.Content>
    </Popover.Root>
  );
};

export default PopoverBtn;
