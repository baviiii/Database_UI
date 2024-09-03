import React from "react";

import {
  CircularProgress,
  Paper,
  Typography,
  Button,
  styled,
  Modal,
  Grid,
  TextField,
  ListItemButton,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

import Box from "@mui/material/Box";

import axios from "axios";

import { BASE_URL } from "../../config";

/**
 * A dictionary holding the default modal css
 * styles.
 *
 * @type {{border: string, p: number, boxShadow: number, transform: string, bgcolor: string, top: string, left: string, maxHeight: string, width: number, position: string}}
 */
export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '95%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/**
 * A @mui styled object that holds the styles
 * of the data grid (table)
 *
 * @type {StyledComponent<PropsOf<DataGridComponent> & MUIStyledCommonProps<Theme>, {}, {}>}
 */
export const StyledDataGrid = styled(DataGrid)(() => ({
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 500,
    fontFamily: 'GT Walsheim Pro'
  }
}));


/**
 * Modal object that will be rendered when viewing a health application.
 */
class HealthViewModal extends React.Component {
  /**
   * Construct the modal.
   * @param props initial properties and data
   */
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      data: [],
      handleApproveApplication: props.handleApproveApplication
    };

    this.handleLoadApplication = this.handleLoadApplication.bind(this);
  }

  /**
   * First method called by React, after component has been rendered.
   * It will load the application information.
   */
  componentDidMount() {
    this.handleLoadApplication();
  }

  /**
   * Load the current health application data, and update
   * the component's state.
   */
  handleLoadApplication() {
    const config = {
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

  /**
   * Returns the pages html DOM (JSX
   *
   * @returns {JSX.Element}
   */
  render() {
    const { data } = this.state;

    const itemList = [];

    if (!data) { // if there's no data, render and empty view.
      return (
          <Box>
            Empty
          </Box>
      )
    }

    for (const [key, value] of Object.entries(data)) {         // Iterate over the JSON object containing the application.
      if (!["__v"].includes(key))                              // Ignore certain fields which are not necessary to be viewed
        itemList.push(                                         // Create a grid item to hold the field value and push
                                                               // them into an array.
            <Grid item xs={12} md={6} sm={6} lg={6}>
              { key !== "dob" && key !== "date_of_membership" ?
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


/**
 * Create a member's data object that will be rendered in a data grid row.
 *
 * @param id of the member
 * @param data the object containing member's information
 * @param handleView method to view a member object
 * @param handleApprove method to approve a member's application
 * @returns {{approved, balance: (number|*), data, name, mobile: (string|{type: String | StringConstructor, required: boolean}|*), handleView, id, aid: (null|*), handleApprove, account, email}}
 */
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

// A schema of how the member item row will be generated.
// noinspection JSUnusedGlobalSymbols
const dataColumnsMembers = [
  {
    field: "id",
    headerName: "ID",
    width: 10,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    flex: 1,
  },
  {
    field: "mobile",
    headerName: "Mobile",
    width: "150",
    flex: 1,
  },
  {
    field: "balance",
    header: "Balance",
    width: "150",
    flex: 1,
  },
  {
    field: "action",
    headerName: "Actions",
    minWidth: 150,
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        <Button
          variant="contained"
          disableElevation
          size="small"
          textSizeSmall
          value={params.row.aid}
          onClick={params.row.handleView}
        >
          View
        </Button>
      </Box>
    ),
  },
];

/**
 * Converts any text separated by '-', from its
 * current case to title case
 *
 * @param str The string to convert
 * @returns {string}
 */
function titleCase(str) {
  str = str.toLowerCase();
  str = str.split("_");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

/**
 * Formats the date to human-readable form.
 *
 * @param date to format
 * @returns {string}
 */
function formatDate(date) {
  if (!date) return "None";
  const d = new Date(date);
  return d.toLocaleDateString("en-UK");
}


/**
 * The Membership component that will be rendered in the
 * Membership tab.
 */
export default class Membership extends React.Component {
  /**
   * Construct the membership.
   * @param props the initial properties
   */
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      loading: false,

      open: false,

      openHealth: false,

      currentIdHealth: null,
      currentFormDataHealth: null,

      currentId: null,
      currentFormData: null,

      add_amount: 1000,
    };

    this.handleLoadApplications = this.handleLoadApplications.bind(this);
    this.handleViewApplication = this.handleViewApplication.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);

    this.handleSubmitAmount = this.handleSubmitAmount.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeField = this.handleChangeField.bind(this);

    this.handleUpdateMember = this.handleUpdateMember.bind(this);
    this.handleDeleteMember = this.handleDeleteMember.bind(this);

    this.handleViewHealthApplication = this.handleViewHealthApplication.bind(this);
    this.handleCloseHealth = this.handleCloseHealth.bind(this);
    this.handleApproveHealthApplication = this.handleApproveHealthApplication.bind(this);

    this.handleReloadView = this.handleReloadView.bind(this);
  }

  /**
   * First method run after component has been rendered.
   */
  componentDidMount() {
    // noinspection JSIgnoredPromiseFromCall
    this.handleLoadApplications();
  }

  /**
   * View a members information.
   * @param e
   */
  handleViewApplication(e) {
    const id = e.target.value;
    const { members } = this.state;

    for (let i = 0; i < this.state.members.length; i++) {
      if (members[i].aid === id) { // Check that the member id exists in the state.
        const config1 = {
          method: "get",
          url: `http://localhost:8000/api/health/member/${id}`,
        };

        axios(config1)                   // Load the member from the server
          .then((response) => {
            this.setState({
              currentHealthData: response.data,
              currentId: id,
              currentFormData: members[i].data,
              open: true,
            });
          })
          .catch(function (error) {
            console.log(error);
            alert("Error");
          });
        return;
      }
    }

    const config = {
      method: "get",
      url: `${BASE_URL}/api/membership/id/${id}`,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      crossDomain: true,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.setState({
          currentId: id,
          currentFormData: response.data,
          open: true,
        });
      })
      .catch(function (error) {
        alert("Error opening data");
        console.log(error);
      })
      .finally(() => {
        console.log("Line 209");
        console.log(this.state.currentFormData);

        const config1 = {
          method: "get",
          url: `http://localhost:8000/api/health/member/${this.state.currentFormData._id}`,
        };

        console.log(config1);

        axios(config1)
          .then((response) => {
            this.setState({
              currentHealthData: response.data,
            });
          })
          .catch(function (error) {
            console.log(error);
            alert("Error");
          });
      });
  }

  /**
   * Reload the health data after it has been modified.
   */
  handleReloadView() {
    const config1 = {
      method: "get",
      url: `http://localhost:8000/api/health/member/${this.state.currentId}`,
    };

    axios(config1)
      .then((response) => {
        console.log("Reload Views");
        console.log(response.data);

        this.setState({
          currentHealthData: response.data,
          open: true,
          openHealth: false,
        });
      })
      .catch(function (error) {
        console.log(error);
        alert("Error");
      });
  }

  /**
   * Open the member's modal, to view it.
   */
  handleOpen() {
    this.setState({
      open: true,
    });
  }

  /**
   * Close the current application and reset the current
   * member's id.
   */
  handleClose() {
    this.setState({
      open: false,
      currentId: null,
    });
  }

  /**
   * Close the health application view modal.
   */
  handleCloseHealth() {
    this.setState({
      openHealth: false,
    });
  }

  /**
   * dep
   * @param e
   */
  handleApproveApplication(e) {
    const id = e.target.value;
    alert(id);
  }

  /**
   * Approve a health application and alert the user
   * whether it has been accepted or rejected.
   */
  handleApproveHealthApplication() {
    const id = this.state.currentIdHealth;

    const config = {
      method: "put",
      url: `${BASE_URL}/api/health/link/${id}`,
      headers: {},
    };

    axios(config)
      .then((response) => {
        alert("Success");
        console.log(response.data);
      })
      .catch(function (error) {
        alert(error.response.data["message"]);
      })
      .finally(() => {
        this.handleReloadView(id);
      });
  }

  /**
   * Load the members' applications.
   * @returns {Promise<void>}
   */
  async handleLoadApplications() {
    this.setState({ loading: true });

    const config = {
      method: "get",
      url: `${BASE_URL}/api/membership/`,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    const res = [];

    this.setState(
      {
        members: res,
      },
      () => {
        if (this.state.currentId) {
          for (let i = 0; i < this.state.members.length; i++) {
            if (this.state.members[i].aid === this.state.currentId) {
              this.setState({
                currentFormData: this.state.members[i].data,
                open: true,
              });
              return;
            }
          }
        }
      }
    );

    axios(config)
      .then((response) => {
        const data = response.data;
        const res = [];
        for (let i = 0; i < data.length; i++) {
          res.push(
            createData(
              i + 1,
              data[i],
              this.handleViewApplication,
              this.handleApproveApplication
            )
          );
        }
        this.setState({
          members: res,
        });
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  /**
   * Change the amount which is to be funded to a user's account.
   * @param e
   */
  handleChangeAmount(e) {
    console.log("Change");
    console.log(e.target.value);
    this.setState({
      add_amount: e.target.value
    })
  }

  /**
   * Update the members information based on the currently edited values.
   */
  handleUpdateMember() {
    const data = this.state.currentFormData;
    delete data["_id"];
    delete data["__v"];

    console.log(data);

    const config = {
      method: "put",
      url: `${BASE_URL}/api/membership/update/id/${this.state.currentId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        // noinspection JSIgnoredPromiseFromCall
        this.handleLoadApplications();
        alert("Success");
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
        alert("Failed");
      });
  }

  /**
   * Delete a member's information.
   */
  handleDeleteMember() {
    if (!this.state.currentId) return;

    const config = {
      method: "delete",
      url: `${BASE_URL}/api/membership/delete/${this.state.currentId}`,
      headers: {},
    };

    axios(config)
      .then((response) => {
        this.setState({
          open: false,
          currentId: null,
          currentFormData: null,
        });
        // noinspection JSIgnoredPromiseFromCall
        this.handleLoadApplications();
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
        alert("Failure");
      });
  }

  /**
   * Update the values of the member based on
   * the user's input to the fields text fields and
   * date picker.s
   *
   * @param e
   */
  handleChangeField(e) {
    const id = e.target.id;
    const value = e.target.value;
    console.log(`${id} - ${value}`);
    this.setState({
      currentFormData: { ...this.state.currentFormData, [id]: value },
    });
  }

  /**
   * Submit amount to fund a user's account.
   */
  handleSubmitAmount() {
    const data = {
      amount: parseInt(this.state.add_amount),
    };

    const id = this.state.currentFormData
      ? this.state.currentFormData.member_id
      : null;

    const config = {
      method: "put",
      url: `${BASE_URL}/api/membership/fund/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function () {
        alert("Success");
      })
      .catch(function (error) {
        console.log(error);
        alert(error.response.data["message"]);
      })
      .finally(() => {
        // noinspection JSIgnoredPromiseFromCall
        this.handleLoadApplications();
      });
  }

  /**
   * View the selected health application.
   *
   * @param id of the health application.
   */
  handleViewHealthApplication(id) {
    console.log(id);

    this.setState({
      currentIdHealth: id,
      openHealth: true,
    });
  }

  /**
   * Returns the pages html DOM (JSX
   * @returns {JSX.Element}
   */
  render() {
    const data = this.state.currentFormData;

    const itemList = [];

    if (data)
      for (const [key, value] of Object.entries(data)) {
        if (["__v", "account_balance"].includes(key)) continue;

        itemList.push(
          <Grid item xs={12} md={6} sm={6} lg={6}>
            {key !== "dob" && key !== "date_of_membership" ? (
              <TextField
                id={key}
                label={titleCase(key)}
                value={value}
                size="small"
                sx={{ maxWidth: "100%", width: 320 }}
                onChange={this.handleChangeField}
              />
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  id={key}
                  label={titleCase(key)}
                  value={value}
                  onChange={(f) => f}
                  readOnly={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      InputProps={{
                        readOnly: false,
                      }}
                      sx={{ maxWidth: "100%", width: 320 }}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          </Grid>
        );
      }

    return (
      <Box
        sx={{
          p: 0,
          m: 0,
          gap: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // maxWidth: 700s
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, m: 1 }}>
          <Typography variant="h5" component="div" gutterBottom>
            Memberships
          </Typography>
        </Box>

        <Modal open={this.state.openHealth} onClose={this.handleCloseHealth}>
          <Box sx={{ ...modalStyle, maxWidth: 700 }}>
            <HealthViewModal
              id={this.state.currentIdHealth}
              handleApproveApplication={this.handleApproveHealthApplication}
            />
          </Box>
        </Modal>

        <Modal open={this.state.open} onClose={this.handleClose}>
          <Box sx={{ ...modalStyle, minWidth: "70%" }}>
            <Grid container spacing={1}>
              <Grid item xs={7}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1">Member Details</Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Grid container spacing={2} sx={{ maxWidth: 700 }}>
                        {itemList}
                      </Grid>
                    </Box>
                  </Box>
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
                              onChange={this.handleChangeAmount}
                              sx={{ maxWidth: "100%", width: 320 }}
                              InputProps={{
                                readOnly: false,
                              }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Button
                              variant="outlined"
                              sx={{ minWidth: "100%" }}
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
                        height: 470,
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
                        {this.state.currentHealthData ? (
                          <List
                            sx={{ width: "100%", bgcolor: "background.paper" }}
                            style={{ maxHeight: 470, overflow: "auto" }}
                          >
                            {this.state.currentHealthData.map((h_data) => (
                              <ListItemButton
                                onClick={() =>
                                  this.handleViewHealthApplication(h_data._id)
                                }
                                divider
                              >
                                <ListItemText
                                  primary={`${h_data.reason} - ${
                                    h_data.linked ? "approved" : "not approved"
                                  }`}
                                  secondary={`$${h_data.amount} - ${formatDate(
                                    h_data.date
                                  )}`}
                                />
                              </ListItemButton>
                            ))}
                          </List>
                        ) : (
                          ""
                        )}
                      </Box>
                    </Paper>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      width: "100%",
                      maxHeight: "100%",
                      border: 1,
                      borderRadius: 1,
                      borderColor: "#efefef",
                      p: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      disableElevation
                      onClick={this.handleUpdateMember}
                    >
                      Update
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      disableElevation
                      onClick={this.handleDeleteMember}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
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
                rows={this.state.members}
                columns={dataColumnsMembers}
                pageSize={20}
                rowsPerPageOptions={[50]}
                disableSelectionOnClick
              />
            )}
          </Box>
        </Paper>
      </Box>
    );
  }
}
