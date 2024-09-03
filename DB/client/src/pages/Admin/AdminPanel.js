import React from 'react';

import {
  Typography,
  Divider
} from "@mui/material";

import Box from "@mui/material/Box";

import axios from 'axios';
import { LoadingButton } from '@mui/lab';

import { BASE_URL } from '../../config';

import UploadFileIcon from "@mui/icons-material/UploadFile";

/**
 * State ful admin panel. The first tab of the admin page.
 */
export default class AdminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      uploading_members: false,

      members_file: null,
      health_file: null,
    }

    this.handleMembersFileUpload = this.handleMembersFileUpload.bind(this);
  }

  /**
   * Handles the uploading process. Prompts the user for a file
   * and submits it to the server.
   *
   * @param e Button instance
   */
  handleMembersFileUpload(e) {
    if (!e.target.files) {                      // Validate that a file has been selected.
      return
    }

    const file = e.target.files[0];            // Select the first file.
    const formData = new FormData();           // Create a form object to hold the form.
    formData.append("members", file);

    const options = {
      method: 'POST',
      url: `${BASE_URL}/api/membership/upload`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }

    axios.request(options).then(() => {
      alert("Uploaded Successfully");
    }).catch((error) => {
      alert("Failed to upload");
      console.log(error.response.data);
    }).finally(() => {
      this.setState({
        uploading_members: false
      })
    })
  }

  /**
   * Returns the pages html DOM (JSX)
   *
   * @returns {JSX.Element}
   */
  render() {
    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 500 }}>
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
            <Typography variant="h5" component="div" gutterBottom>
              Admin Panel
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
            <Typography>
              Upload Existing Members (.csv file)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <LoadingButton
                loading={this.state.uploading_members}
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                disableElevation
              >
                Upload Profile
                <input type="file" hidden accept=".csv" onChange={this.handleMembersFileUpload}/>
              </LoadingButton>
            </Box>
            <Divider />
          </Box>
        </Box>
    );
  }
}