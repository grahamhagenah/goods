import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Divider from '@mui/material/Divider';
import { FaUserFriends } from 'react-icons/fa';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


const GroupMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 20,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '8px',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        borderRadius: 20,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity,),
      },
    },
  },
}));

export default function GroupInfo( props ) {

  const date = new Date(props.group.createdAt)
  const createdAt = date.toLocaleDateString();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
        <Button
          id="group-indicator"
          aria-controls={open ? 'group-indicator' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <FaUserFriends className="mr-3"/>
          <p className="group-name">{props.group.name}</p>
        </Button>
        <GroupMenu
          id="group-indicator"
          MenuListProps={{
            'aria-labelledby': 'group-indicator',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
        <MenuItem onClick={handleClose} disableRipple>
          <CalendarMonthIcon className="dropdown-icon mr-3"/>
          <p>Created {createdAt}</p> 
        </MenuItem>
        <Divider />
        {props.group.users.map((user) =>
          <MenuItem key={user.name} onClick={handleClose} disableRipple>
            <AccountCircleIcon className="dropdown-icon mr-3"/>
            {user.name + " " + user.surname}
          </MenuItem>
        )}
      </GroupMenu>
    </div>
  );
}