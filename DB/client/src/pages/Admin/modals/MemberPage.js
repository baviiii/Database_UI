import React from 'react';

import {
  CircularProgress,
  Paper,
  Typography,
  Button,
  styled,
  Modal,
  Grid,
  TextField,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Box from "@mui/material/Box";

import axios from "axios";

import { BASE_URL } from '../../../config';

import { 
  ApplicationForm,
  createData,
  modalStyle,
  StyledDataGrid,
 } from '../Applications';


 function titleCase(str) {
  str = str.toLowerCase();
  str = str.split("_");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

function formatDate(date) {
  if (!date) return "None";
  const d = new Date(date);
  var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  return d.toLocaleDateString("en-UK");
}

export function MemberPageModal(props) {
  
  const [currentFormData, setCurrentFormData] = React.useState(props.memberData);
  const [currentHealthData, setCurrentHealthData] = React.useState(props.healthData);
  const [addAmount, setAddAmount] = React.useState(1500);
  const [currentId, setCurrentId] = React.useState(props.memberData._id);

  const handleChangeField = (e) => {
    const id = e.target.id;
    const value = e.target.value;


  }

  return (
    <Box>
      Hello
    </Box>
  )
}


export default class MemberPage extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      currentFormData: props.memberData,
      currentHealthData: props.healthData,
      add_amount: 1500,
      currentId: props.memberData._id,
    }

    console.log(this.state);

    this.handleUpdateMember = this.handleUpdateMember.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);
  }


  handleUpdateMember() {

  }

  handleChangeField(e) {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({
      [id]: value
    })
  }

  render() {
    const data = this.state.currentFormData;
    const itemList = [];

    for (const [key, value] of Object.entries(data)) {
      itemList.push(
        <Grid item xs={12} md={6} sm={6} lg={6}> { key !== "dob" && key !== "date_of_membership" ?
          <TextField
            id={key}
            label={titleCase(key)}
            value={value}
            size="small"
            sx={{ maxWidth: "100%", width: 320 }}
            onChange={this.handleChangeField}
            InputProps={{
              readOnly: false,
            }}
          />
          :
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
             id={key}
             label={titleCase(key)}
             value={value}
             onChange={(f) => f}
             readOnly={true}
            renderInput={(params) => <TextField {...params}  size="small"  InputProps={{
              readOnly: false,
            }}  sx={{ maxWidth: "100%", width: 320 }} />}
          /> 
        </LocalizationProvider>
        }
        </Grid>
      )
    }

    return (
      <Box sx={{...modalStyle, minWidth: '70%'}}>
      <Grid container spacing={1}>
        <Grid item xs={7}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1">Member Details</Typography>
            <ApplicationForm
              application_id={this.state.currentId}
              data={this.state.currentFormData}
            />
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
              maxHeight: "100%",
            }}
          >
            <Box
              sx={{
                margin: 0,
                maxHeight: 200,
                minWidth: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="subtitle1">Finances</Typography>
              <Paper
                variant="outlined"
                sx={{ margin: 0, padding: 1, minWidth: 200 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "100%",
                    minHeight: "100%",
                    gap: 1,
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={8}>
                      <TextField
                        label="Add Amount"
                        size="small"
                        value={this.state.add_amount}
                        onClick={this.handleChangeAmount}
                        sx={{ maxWidth: "100%", width: 320 }}
                        InputProps={{
                          readOnly: false,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant="outlined"
                        sx={{ minwidth: "100%" }}
                        onClick={this.handleSubmitAmount}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6} spacing={1}>
                      <TextField
                        label="Balance"
                        size="small"
                        value={
                          this.state.currentFormData
                            ? this.state.currentFormData.account_balance
                            : null
                        }
                        sx={{ maxWidth: "90%", width: 320, mr: 1 }}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Spent"
                        size="small"
                        sx={{ maxWidth: "90%", width: 320 }}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>
            <Box
              sx={{
                margin: 0,
                minHeight: 200,
                minWidth: "100%",
                maxHeight: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="subtitle1">
                Health Applications
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  margin: 0,
                  height: 350,
                  maxHeight: "100%",
                  minWidth: 200,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "100%",
                    minHeight: "100%",
                  }}
                >
                  
                  {
                  
                  this.state.currentHealthData ? 
                  
                  (

                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      {
                        this.state.currentHealthData.map(h_data => (
                          <ListItem divider>
                            <ListItemText primary={h_data.reason} secondary={`\$${h_data.amount} - ${formatDate(h_data.date)}`} />
                          </ListItem>
                        ))
                      }
                    </List>

                  ) : "" 
                  
                  }
                </Box>
              </Paper>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              width: "100%",
              maxHeight: "100%",
              border: 1,
              borderRadius: 1,
              borderColor: 'gray',
              p: 2,
            }}
          >
            <Button variant="contained" color="success" disableElevation>
              Update
            </Button>

            <Button variant="contained" color="error" disableElevation>
              Delete
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
    )
  }
}