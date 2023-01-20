import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

export default function ArrowTooltips( props ) {
  return (
    <Tooltip title={"Updated by " + props.firstName + ", " + props.date} 
      arrow 
      placement="left"
      >
      <span className="name-label font-bold">{props.firstLetter}</span>
    </Tooltip>
  );
}