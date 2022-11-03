import {Box, Button as ButtonMui, Container, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link} from "react-router-dom";
import NotFounding from '../assets/NotFound.png'
import styled from "styled-components";

const Button = styled(ButtonMui)`
  && {
    color: white;
    padding: 7px 13px;
    background-color: #4968a3;
    :hover {
      background-color: rgba(73, 104, 163, 0.7);
    }
  }
`;

const NotFound = () => (
	<>
		<Box
			component="main"
			sx={{
				alignItems: 'center',
				display: 'flex',
				flexGrow: 1,
				minHeight: '100%'
			}}
		>
			<Container maxWidth="md">
				<Box
					sx={{
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Typography
						align="center"
						color="textPrimary"
						variant="h2"
						sx={{
							marginTop: '50px',
							marginBottom: '25px',
						}}
					>
						404: The page you are looking for isn’t here
					</Typography>
					<Typography
						align="center"
						color="textPrimary"
						variant="subtitle1"
					>
						You either tried some shady route or you came here by mistake.
						Whichever it is, try using the navigation
					</Typography>
					<Box sx={{textAlign: 'center'}}>
						<img
							alt="Under development"
							src={NotFounding}
							style={{
								marginTop: 50,
								display: 'inline-block',
								maxWidth: '100%',
								width: 560
							}}
						/>
					</Box>
					<Link className="link" to={'/'}>
						<Button
							component="a"
							startIcon={(<ArrowBackIcon fontSize="small"/>)}
							sx={{mt: 3, mb: 6}}
							variant="contained"
						>
							Go back to landing page
						</Button>
					</Link>
				</Box>
			</Container>
		</Box>
	</>
);

export default NotFound;