import ring from './ring.png'
import { Typography, Box } from '@mui/material';


function Logo(){
    return(
    <Box sx={{
        display: "flex",
        alignItems: "center"
        }}>
        <img src={ring} alt="Logo" height="100px" style={{ marginLeft: '10px' }}/>
        <Typography variant="h1" sx= 
        {{ fontFamily: 'Rubik Mono One, monospace',
        fontSize: "60px",
        marginLeft: "10px" }}>
            Box 
        </Typography>
        <Typography variant="h1" sx= 
        {{ fontFamily: 'Rubik Mono One, monospace',
        fontSize: "60px",
        marginLeft: "10px",
        color: "#00B4D8"}}>
            Find
        </Typography>
    </Box>
    );
}

export default Logo
