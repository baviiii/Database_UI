import React from 'react';

import { Container, Box } from "@mui/system";
import { withCookies } from "react-cookie";
import { Button, Paper, TextField, Typography } from '@mui/material';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errText: ""
    }
  }

  handleChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  handleChangePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  render() {

    return (
      <Box>
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Paper 
              variant="outlined"
              sx={{
                minWidth: 300,
                minHeight: 250,
                margin: 5
              }}
               >
            <form>
              <Box 
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  alignContent: "space-between",
                  padding: 1,
                  gap: 2,
                }}
              >
                <Typography variant="subtitle2" component="div">
                  Login Form
                </Typography>

                <TextField
                  required
                  label="Email"
                  type="email"
                  size="small"
                  value={this.state.email}
                  onChange={this.handleChangeEmail}
                  sx={{ width: '100%' }}
                />

                <TextField
                  required
                  label="Password"
                  type="password"
                  size="small"
                  value={this.state.password}
                  onChange={this.handleChangePassword}
                  sx={{ width: '100%' }}
                />

                <Button variant="contained" disableElevation sx={{ width: '100%' }}>
                  Login
                </Button>

                <Typography variant="caption" component="div" color="error">
                  Error
                </Typography>
              </Box>
            </form>
            </Paper>
          </Box>
        </Container>
      </Box>
    )
  }
}


export default withCookies(Login);