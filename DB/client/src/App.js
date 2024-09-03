import React from 'react';

// Mui UI Kit Components,
import { AppBar, Button, CssBaseline, IconButton, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { ThemeProvider } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

import {
  Outlet, // pass react pages into routes
  useNavigate // change routes, without reloading the page
} from "react-router-dom";


import { theme } from './Mtheme';

/**
 * Top app bar component. Houses our navigation routes; admin, application, home
 *
 * @param props any properties
 * @returns {JSX.Element}
 * @constructor
 */
function TopAppBar(props) {
  const { navigate } = props; // get navigate from props

  /**
   * Handle home navigations
   */
  const handleHomePage = () => {
    navigate("/"); // change to base route /
  }

  /**
   * Handle add member
   */
  const handleAddMemberPage = () => {
    navigate("/add_member"); // change to /application router
  }

  /**
   * Handle admin page navigation
   */
  const handleAdminPage = () => {
    navigate("/admin");
  }

  // Return DOM object, to be rendered
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleHomePage}
          >
            <HomeRoundedIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.title}
          </Typography>
          <Button color="inherit" onClick={handleAddMemberPage}>Add Member</Button>

          <Button color="inherit" onClick={handleAdminPage}>Admin</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

/**
 * Stateful AppComponent. Renders the main page.
 */
class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    // Store component variables.
    this.state = {
      title: "Kokatha Membership Database"
    }

    this.handleSetTitle = this.handleSetTitle.bind(this); // Bind function to `this` component.
  }

  handleSetTitle(title) {
    this.setState({
      title: title
    })
  }

  /**
   * React component method that renders the JSX to html DOM
   *
   * @returns {JSX.Element}
   */
  render() {

    return (
      <ThemeProvider theme={theme}>
      <React.Fragment>
          <CssBaseline />
          <Box
            sx={{
              p: 0,
              m: 0,
              position: "relative",
              w: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TopAppBar title={this.state.title} navigate={this.props.navigate} />

            <Outlet setTitle={this.handleSetTitle} /> {/* Redirect child pages based on router; Home, Admin,  --> */}
          </Box>
      </React.Fragment>
      </ThemeProvider>
    )
  }
}


/**
 * Entry point to our main page
 *
 * @param props any properties that we pass into our child nodes
 * @returns {JSX.Element}
 * @constructor
 */
export default function App(props) {
  const navigate = useNavigate(); // useNavigate instance

  return <AppComponent {...props} navigate={navigate} />
}