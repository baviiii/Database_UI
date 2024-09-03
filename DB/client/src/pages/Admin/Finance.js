import React from "react";

import {
  Typography,
  TextField,
  Divider,
} from "@mui/material";

import Box from "@mui/material/Box";

import axios from "axios";
import { LoadingButton } from "@mui/lab";

import { BASE_URL } from "../../config";

/**
 * Stateful Finance component that will be viewed on
 * the financial tab.
 */
export class Finance extends React.Component {

  /**
   * Construct the component
   *
   * @param props the initial component's properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      update_amount_kokatha: 1000,
      loading_update_amount_kokatha: false,

      uploading_members: false,

      members_file: null,
      health_file: null,

      stats: {
        balance: 0,
        allocated: 0,
        linked: 0
      }
    };

    this.handleUpdateAmountText = this.handleUpdateAmountText.bind(this);
    this.handleUpdateAmountKokatha = this.handleUpdateAmountKokatha.bind(this);

    this.handleLoadStats = this.handleLoadStats.bind(this);
  }

  /**
   * This method is called after the component has been
   * generated, and loads the company's financial stats.
   */
  componentDidMount() {
    this.handleLoadStats(); // load the stats
  }

  /**
   * Load the company's stats from the server.
   */
  handleLoadStats() {
    const config = {
      method: "get",
      url: `${BASE_URL}/api/finance/stats`,
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios(config).then((res) => {
      this.setState({
        stats: res.data
      })
      
    }).catch((err) => {
      alert("Failed");
      console.log(err);
    });
  }

  /**
   * Add funds to the company's account based the
   * user's input.
   */
  handleUpdateAmountKokatha() {
    this.setState({
      loading_update_amount_kokatha: true,
    });

    const config = {
      method: "post",
      url: `${BASE_URL}/api/finance/fund/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        amount: parseInt(this.state.update_amount_kokatha),
      },
    };

    console.log(config);

    axios(config)
      .then(() => {
        alert("Success");
      })
      .catch(function (error) {
        alert("Failed");
        console.log(error.response);
      })
      .finally(() => {
        this.setState({
          loading_update_amount_kokatha: false,
        });
        this.handleLoadStats();
      });
  }

  /**
   * Update the text field value as the user types
   * into it.
   * @param e
   */
  handleUpdateAmountText(e) {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({
      [id]: [value]
    });
  }

  /**
   * Returns the pages html DOM (JSX)
   *
   * @returns {JSX.Element}
   */
  render() {
    const { stats } = this.state;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 500 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h5" component="div" gutterBottom>
            Finance
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, m: 1 }}>
          <Typography>Update Kokatha Account</Typography>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 1, my: 0 }}>
            <TextField
              id="update_amount_kokatha"
              label="Amount"
              value={this.state.update_amount_kokatha}
              size="small"
              type="number"
              sx={{ maxWidth: "100%", width: 320 }}
              onChange={this.handleUpdateAmountText}
              InputProps={{
                readOnly: false,
              }}
            />

            <LoadingButton
              variant="contained"
              loading={this.state.loading_update_amount_kokatha}
              onClick={this.handleUpdateAmountKokatha}
              disableElevation
            >
              Fund Account
            </LoadingButton>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, m: 0 }}>
            <Typography variant="h6">Stats</Typography>

            <Box sx={{ display: 'flex', flexDirection: "row", gap: 1, m: 0 }}>
              <Typography variant="button">
                Account Balance:
              </Typography>

              <Typography variant="subtitle1" sx={{ textStyle: "italic" }}>
                $ {stats.balance}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: "row", gap: 1, m: 0 }}>
              <Typography variant="button">
                Amount Allocated (Unused):
              </Typography>

              <Typography variant="subtitle2">
                $ {stats.allocated}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: "row", gap: 1, m: 0 }}>
              <Typography variant="button">
                Amount Used:
              </Typography>

              <Typography variant="subtitle1" sx={{ textStyle: "italic" }}>
                $ {stats.linked}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}
