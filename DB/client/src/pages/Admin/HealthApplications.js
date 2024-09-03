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

const dataColumnsHealthApplications = [
  {
    field: 'id', headerName: 'ID', width: 10,
  },
  {
    field: 'single_name', headerName: 'Single Name', width: 1, flex: 1,
  },
  {
    field: 'dob', headerName: 'D.O.B', width: 1, flex: 1,
  },
  {
    field: 'phone', headerName: 'Phone', width: 1, flex: 1,
  },
  

]