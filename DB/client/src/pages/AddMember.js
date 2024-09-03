import React from "react";

import {
  Alert,
  Box,
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

import { withCookies } from "react-cookie";
import axios from "axios";

import { BASE_URL } from "../config";

import { titleCase } from "../utils";

/**
 * Stateful AddMember react components.
 *
 * Contains the forms required to send member information
 * from the client side web app to the server application
 * then into the database.
 *
 */
class AddMember extends React.Component {

  /**
   * Entry point of the component
   * @param props component's properties
   */
  constructor(props) {
    super(props); // pass props from the constructor's into the component

    // The components variables
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


    // Bind member components members to it.
    this.handleUpdateField = this.handleUpdateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateDate = this.handleUpdateDate.bind(this);
    this.handleUpdateDom = this.handleUpdateDom.bind(this);
  }

  componentDidMount() { // first method called after a component has been rendered

  }

  /**
   * Update a specific text field
   *
   * @param e Text field instance
   */
  handleUpdateField(e) {
    const id = e.target.id;
    const value = e.target.value;

    this.setState({
      [id]: value, // set the passed key with the passed variable
    });
  }

  handleUpdateDate(value) {
    console.log(value);
    this.setState({
      dob: value
    })
  }

  /**
   * Handle update Date of Month value
   * @param value current selected date
   */
  handleUpdateDom(value) {
    this.setState({
      date_of_membership: value
    })
  }

  /**
   * Submits the user's information to the database.
   */
  handleSubmit() {
    this.setState({
      loading: true,                                     // Set loading to true, to visually show the user that the submission process has began.
    });

    const data = JSON.stringify(this.state);             // Convert the class state object to string value

    // Set the POST request parameters
    const config = {
      method: 'POST',                                    // POST request to send data to the server
      url: `${BASE_URL}/api/membership/create_member`,   // set the URL
      headers: {                                         // Define the header metadata, set the content-type to
        'Content-Type': 'application/json',              // JSON since we're posting JSON data.
        'Access-Control-Allow-Origin': '*'
      },
      data: data                                         // Set the data
    };

    axios.request(config).then(function(res) {  // Handle on successful posting
      console.log(res.data);
      alert("Success");                                               // inform the user
    }).catch(function(err) {                                          // Handle on error
      console.log(err);                                               // log the error and alert the user
      alert("Failed")
    }).finally(() => {                                    // Finally,
      this.setState({                                         // Set the loading variable to false; showing that the process is done.
        loading: false,
      })
    })
  }

  /**
   * Returns the JSX values of this component.
   * Will be called each time the state changes.
   * @returns {JSX.Element}
   */
  render() {
    const status = { type: "", label: "", message: "" }
    const { application_status } = this.state; // get the form status from the state
                                               // this will help in presenting the error messages to the user

    if (application_status === 1) {
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

export default withCookies(AddMember);
