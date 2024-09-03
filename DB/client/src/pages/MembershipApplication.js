import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import React from "react";
import { withCookies } from "react-cookie";
import { BASE_URL } from "../config";
import axios from "axios";

function titleCase(str) {
  str = str.toLowerCase();
  str = str.split("_");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

titleCase("I'm a little tea pot");

class MembershipApplication extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      mobile: "",
      email: "",
      work_phone: "",
      member_id: "",
      street_address: "",
      suburb: "",
      state: "",
      dob: dayjs(),
      date_of_membership:  dayjs(),

      form_fields: [
        "name",
        "mobile",
        "email",
        "home_phone",
        "work_phone",
        "member_id",
        "street_address",
        "suburb",
        "state"
      ],

      application_status: 1,
      application_message: "Fill all forms",
      loading: false,
    };

    this.handleUpdateField = this.handleUpdateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateDate = this.handleUpdateDate.bind(this);
    this.handleUpdateDom = this.handleUpdateDom.bind(this);
  }

  componentDidMount() {
  }


  handleUpdateField(e) {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({
      [id]: value,
    });
  }

  handleUpdateDate(value) {
    console.log(value);
    this.setState({
      dob: value
    })
  }
  
  handleUpdateDom(value) {
    this.setState({
      date_of_membership: value
    })
  }

  handleSubmit() {
    this.setState({
      loading: true,
    });

    const data = JSON.stringify(this.state);

    const config = {
      method: 'POST',
      url: `${BASE_URL}/api/create_member`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      data: data
    };

    axios.request(config).then(function(res) {
      console.log(res.data);
    }).catch(function(err) {
      console.log(err);
    }).finally(() => {
      this.setState({
        loading: false,
      })
    })
  }
  render() {
    const status = { type: "", label: "", message: "" }
    const { application_status } = this.state;
    if (application_status === 0) {
      status["type"] = "info";
      status["label"] = "Awaiting approval";
      status["message"] = "We are accessing your application";
    } else if (application_status === 1) {
      status["type"] = "warning";
      status["label"] = "Correct your form";
      status["message"] = this.state.application_message;
    } else {
      status["type"] = "success";
      status["label"] = "Successfully Registered";
    }

    return (
      <Box>
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                minWidth: 300,
                minHeight: 250,
                margin: 5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 1,
                  gap: 2,
                }}
              >
                <Typography variant="subtitle1" component="div">
                  Membership Details Form
                </Typography>

                {this.state.error ? (<Alert severity="error">Invalid Data</Alert>) : null }
                <Grid container spacing={2} sx={{ maxWidth: 700 }}>
                  {this.state.form_fields.map((name) => (
                    <Grid item xs={12} md={6} sm={6} lg={6}>
                      <TextField
                        id={name}
                        label={titleCase(name)}
                        size="small"
                        sx={{ maxWidth: "100%", width: 320 }}
                        onChange={this.handleUpdateField}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12} md={6} sm={12} lg={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker 
                        label="Date of Birth"
                        id="dob"
                        value={this.state.dob}
                        onChange={this.handleUpdateDate}
                        renderInput={(params) => <TextField {...params}  size="small"  sx={{ maxWidth: "100%", width: 320 }} />}
                      /> 
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6} sm={12} lg={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker 
                        label="Date of Membership"
                        id="date_of_membership"
                        value={this.state.date_of_membership}
                        onChange={this.handleUpdateDom}
                        renderInput={(params) => <TextField {...params}  size="small"  sx={{ maxWidth: "100%", width: 320 }} />}
                      /> 
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ maxWidth: 700 }}>
                  <Grid item xs={12} md={6} sm={12} lg={6}>
                    <LoadingButton
                      loading={this.state.loading}
                      variant="contained"
                      disableElevation={true}
                      onClick={this.handleSubmit}
                      sx={{ maxWidth: 320, minWidth: 320 }}
                    >
                      Submit
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }
}

export default withCookies(MembershipApplication);
