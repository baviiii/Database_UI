import React from 'react';

import {
  CircularProgress, Paper,
  Typography,
  Button,
  styled,
  Modal,
  Grid,
  TextField
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

import Box from "@mui/material/Box";

import axios from 'axios';
import { BASE_URL } from '../../config';


export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  // minWidth: '90%',
  maxHeight: '95%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const StyledDataGrid = styled(DataGrid)(({ theme })=> ({
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 500,
    fontFamily: 'GT Walsheim Pro'
  }
}));

export function createData(id, data, handleView, handleApprove) {
  return {
    id: id,
    aid: data._id,
    account: data.account,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    approved: data.approved,
    balance: data.account_balance,
    handleView: handleView,
    handleApprove: handleApprove,
    data: data
  }
}

export function createHealthData(id, data, handleLinkApplication, handleViewApplication) {
  return {
    _id: data._id,
    id: id,
    name: data.name,
    dob: data.dob,
    phone: data.phone,
    address: data.address,
    amount: data.amount,
    reason: data.reason,
    link: data.reason,
    handleLink: handleLinkApplication,
    handleView: handleViewApplication
  }
}

const dataColumnsHealthApplications = [
  {
    field: 'id', headerName: 'ID', width: 10,
  },
  {
    field: 'name', headerName: 'Name', width: 1, flex: 1,
  },
  // {
  //   field: 'dob', headerName: 'D.O.B', width: 1, flex: 1,
  // },
  {
    field: 'phone', headerName: 'Phone', width: 1, flex: 1,
  },
  // {
  //   field: 'address', headerName: 'Address', width: 1, flex: 1,
  // },
  {
    field: 'amount', headerName: 'Amount', width: 1, flex: 1,
  },
  {
    field: 'reason', headerName: 'Reason', width: 1, flex: 1,
  },
  {
    field: 'link', headerName: 'Link', width: 1, flex: 1,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        <Button 
          variant="contained" disableElevation
          onClick={params.row.handleLink}
          value={params.row._id}
          >
          Link
        </Button>

        <Button 
          variant="contained" disableElevation
          onClick={params.row.handleView}
          value={params.row._id}
          >
            View
        </Button>
      </Box>
    )
  }
]


function titleCase(str) {
  str = str.toLowerCase();
  str = str.split("_");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

export function ApplicationForm(props) {
  const [data] = React.useState(props.data);

  const itemList = [];

  if (!data) {
    return (
      <Box>
        Empty
      </Box>
    )
  }

  for (const [key, value] of Object.entries(data)) {
    itemList.push(
      <Grid item xs={12} md={6} sm={6} lg={6}> { key !== "dob" && key !== "date_of_membership" ?
        <TextField
          id={key}
          label={titleCase(key)}
          value={value}
          size="small"
          sx={{ maxWidth: "100%", width: 320 }}
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Grid container spacing={2} sx={{ maxWidth: 700 }}>
        {itemList}
      </Grid>
    </Box>
  )
}


export class HealthViewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      data: [],
      handleApproveApplication: props.handleApproveApplication
    };

    this.handleLoadApplication = this.handleLoadApplication.bind(this);
  }

  componentDidMount() {
    this.handleLoadApplication();
  }

  handleLoadApplication() {
    var config = {
      method: 'get',
      url: `${BASE_URL}/api/health/id/${this.state.id}`,
    };

    axios(config).then((res) => {
      this.setState({
        data: res.data
      })
    }).catch(function(error) {
      console.log(error);
    })
  }

  render() {
    const { data } = this.state;

    const itemList = [];

    if (!data) {
      return (
        <Box>
          Empty
        </Box>
      )
    }

    for (const [key, value] of Object.entries(data)) {
      if (!["__v"].includes(key))
      itemList.push(
        <Grid item xs={12} md={6} sm={6} lg={6}> { key !== "dob" && key !== "date_of_membership" ?
          <TextField
            id={key}
            label={titleCase(key)}
            value={value}
            size="small"
            sx={{ maxWidth: "100%", width: 320 }}
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Health Application Form
        </Typography>
        <Grid container spacing={2} sx={{ maxWidth: 700 }}>
          {itemList}
        </Grid>

        <Box sx={{
          display: 'flex', flexDirection: 'row', gap: 1,
        }}>
          { !data['linked'] ? (
            <Button variant="contained" onClick={this.props.handleApproveApplication} disableElevation >
              Approve
            </Button>
            ) : null
          }
        </Box>
      </Box>
    )
  }
}



export default class Applications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
      loading: false,

      open: false,
      currentId: null,
      currentFormData: null,

      healthApplications: []
    }

    this.handleLoadApplications = this.handleLoadApplications.bind(this);
    this.handleApproveApplication = this.handleApproveApplication.bind(this);
    this.handleViewApplication = this.handleViewApplication.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);

    this.handleLinkApplication = this.handleLinkApplication.bind(this);
    this.handleViewApplication = this.handleViewApplication.bind(this);
  }

  componentDidMount() {
    this.handleLoadApplications();
  }

  handleViewApplication(e) {
    const id = e.target.value;

    var config = {
      method: 'get',
      url: `${BASE_URL}/api/membership/id/${id}`,
      headers: { }
    };
    
    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.setState({
          currentId: id,
          currentFormData: response.data,
          open: true,
        })
      })
      .catch(function (error) {
        alert("Error opening data");
      });
  }

  // handleViewApplication(e) {
  //   const id = e.target.value;
  //   this.setState({
  //     currentId: id,
  //     open: true
  //   });
  // }

  handleLinkApplication(e) {
    const id = e.target.value;
    
    var config = {
      method: 'put',
      url: `${BASE_URL}/api/health/link/${id}`,
      headers: { }
    };

    axios(config)
      .then((response) => {
        alert("Success");
        console.log(response.data);
      })
      .catch(function (error) {
        alert(error.response.data["message"]);
      }).finally(() => {
        this.handleLoadApplications();
      })
  }

  handleOpen() {
    this.setState({
      open: true
    })
  }

  handleClose() {
    this.setState({
      open: false,
      currentId: null
    })
  }

  handleApproveApplication(e) {
    
  }

  handleLoadApplications() {
    this.setState({loading: true});

    const config = {
      method: 'get',
      url: `${BASE_URL}/api/health`,
    };

    axios(config)
    .then((response) => {
      const data = response.data;
      const res = []
      for (let i = 0; i < data.length; i++) {
        res.push(createHealthData(i + 1, data[i], this.handleLinkApplication, this.handleViewApplication));
      }
      this.setState({
        applications: res
      })
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    }).finally(() => {
      this.setState({loading: false});
    })
  }

  render() {
    return (<Box
      sx={{
        p: 0,
        m: 0,
        gap: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 700,
        width: 1000
      }}
  >
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          Health Applications
        </Typography>
      </Box>

    <Modal open={this.state.open} onClose={this.handleClose}>
      <Box sx={{...modalStyle, maxWidth: 700}}>
        {/* <ApplicationForm application_id={this.state.currentId} data={this.state.currentFormData}/> */}
        <HealthViewModal id={this.state.currentId} />
      </Box>
    </Modal>
    <Paper
        variant="outlined"
        elevation={0}
        sx={{
          p: 1,
          mx: 0,
          my: 1,
          width: "100%",
          height: "100%",
          borderRadius: 1,
        }}
    >
      <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: 500,
          }}
      >
        {this.state.loading ? (
                  <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: 450,
                        m: 0,
                      }}
                  >
                    <CircularProgress />
                  </Box>
              ) : (
                  <StyledDataGrid
                      rows={this.state.applications}
                      columns={dataColumnsHealthApplications}
                      pageSize={20}
                      rowsPerPageOptions={[50]}
                      disableSelectionOnClick
                  />
              )}
        </Box>
        </Paper>
        </Box>
        )
  }
}