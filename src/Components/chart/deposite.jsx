import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './title';
import "./index.css"

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits({title , count, onClick}) {
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Typography component="p" variant="h4">
        {count}
      </Typography>
      {/* <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2019
      </Typography> */}
      <div className='view-btn'>
        <Link color="#c20014" href="#" onClick={onClick}>
          View
        </Link>
      </div>
    </React.Fragment>
  );
}