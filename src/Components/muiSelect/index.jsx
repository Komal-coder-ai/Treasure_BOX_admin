import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./index.css"

export default function MuiSelect({ handleChange, data, ind, statusCode }) {
    return (
        <Box sx={{ m: 1, minWidth: 125 }} size="small">
            <FormControl fullWidth className='status_select'>
                {data === "Dispatched" ?
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={data ? data : ""}
                        disabled={data === "Cancelled" || data === "Delivered"}
                        label=""
                        onChange={(e) => handleChange(e, data, ind)}
                    >
                        {statusCode.map((item) =>

                            <MenuItem key={item.id} value={item.orderStatus}
                                disabled={item.orderStatus === "Pending" || item.orderStatus === "Accepted"}
                            >{item.orderStatus}</MenuItem>

                        )}

                    </Select>
                    :
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={data ? data : ""}
                        disabled={data === "Cancelled" || data === "Delivered"}
                        label=""
                        onChange={(e) => handleChange(e, data, ind)}
                    >
                        {statusCode.map((item) =>

                            <MenuItem key={item.id} value={item.orderStatus}
                                disabled={item.orderStatus === "Pending" ? data === "Accepted" || data === "Dispatch" : ""}
                            >{item.orderStatus}</MenuItem>

                        )}

                    </Select>}



            </FormControl>
        </Box>
    );
}


