import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BsFillGearFill } from 'react-icons/bs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Form, Link } from "@remix-run/react";
import { VscKey } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { FiSettings } from 'react-icons/fi';
import logoOutline from "public/images/goods-icon-outline.svg";

const StyledMenu = styled((props: MenuProps) => (
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

export default function CustomizedMenus( props ) {
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
        id="logged-in-indicator"
        aria-controls={open ? 'logged-in-indicator' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >

        <AccountCircleIcon className="mr-3"/>
        {props.username || "Log In"}

      </Button>
      <StyledMenu
        id="logged-in-indicator"
        MenuListProps={{
          'aria-labelledby': 'logged-in-indicator',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {props.username &&
          <Link to="/goods" className="login-button">
            <MenuItem onClick={handleClose} disableRipple>
              <img className="dropdown-icon mr-3" src={logoOutline} />
              Goods
            </MenuItem>
          </Link>
        }
        <Link to="/login" className="login-button">
          <MenuItem onClick={handleClose} disableRipple>
            <VscKey className="dropdown-icon mr-3"/>
            Login
          </MenuItem>
        </Link>
        {props.username &&
          <Form action="/logout" method="post">
            <button type="submit" id="logout-button">
              <MenuItem onClick={handleClose} disableRipple>
                <FiLogOut className="dropdown-icon mr-3"/>
                Logout
              </MenuItem>
            </button>
          </Form>
          }
        {props.username &&
        <Link to="/account" className="login-button">
          <MenuItem onClick={handleClose} disableRipple>
            <FiSettings className="dropdown-icon mr-3"/>
            Account
          </MenuItem>
        </Link>
        }
      </StyledMenu>
    </div>
  );
}