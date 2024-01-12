/**
 * @author Bugra Karaaslan, 500830631, This is a profile button component.
 */
import {
  Menu,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuButton,
  MenuDivider,
  MenuButtonProps,
} from "@chakra-ui/react";
import {logout} from "../../pages/api/api.storage";

interface ComponentProps extends MenuButtonProps {
  label: string;
  name: string;
  id?: string;
}

export function ProfileBtn({name, label, id, ...props }: ComponentProps) {
  return (
    <Menu>
      <MenuButton as='button'>
        <Avatar bg="eduWhite"  name={name} />
      </MenuButton>
      <MenuList>
        <MenuGroup title="Profile">
          <MenuItem>My Profile</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Help">
          <MenuItem>Docs</MenuItem>
          <MenuItem>FAQ</MenuItem>
          <MenuItem onClick={logout}>Log out</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
