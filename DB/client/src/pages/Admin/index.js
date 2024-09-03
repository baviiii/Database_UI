import React from "react";

import { Box, Tab, Tabs, Container } from "@mui/material";
import PropTypes from "prop-types";
import Membership from "./Memberships";
import AdminPanel from "./AdminPanel";
import { Finance } from "./Finance";

/**
 * Custom TabPanel component that holds the tab buttons.
 *
 * @param props tab properties
 * @returns {JSX.Element}
 * @constructor
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props; // Get prop values
  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`admin-tabpanel-${index}`}
          {...other}
      >
        {value === index && ( // Only show the tabs children when its index is similar to
                              // the index of the currently viewed tab.
            <Box sx={{p: 3}}>
              {children}
            </Box>
        )}
      </div>
  )
}

/**
 * Define the data types and other properties of the variables
 * to be passed into the TabPanel via props.
 *
 * @type {{children: Requireable<ReactNodeLike>, index: Validator<NonNullable<number>>, value: Validator<NonNullable<number>>}}
 */
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

/**
 * Forward a dictionary of properties of a tab,
 * prevents rewriting the properties each time we declare
 * a tab object.
 *
 * @param index
 * @returns {{"aria-controls": string, id: string}}
 */
function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    "aria-controls": `admin-tabpanel-${index}`,
  };
}

/**
 * The Stateful admin component that houses the tab menus.
 */
class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Changes the value that represents the index of the
   * tab to be viewed.
   *
   * @param newValue index of the tab to view.
   */
  handleChange(newValue) {
    this.setState({
      value: newValue,
    });
  }

  /**
   * Returns the pages html DOM (JSX
   *
   * @returns {JSX.Element}
   */
  render() {
    const { value } = this.state;

    const handleTabChange = (e, newValue) => {
      this.handleChange(newValue);
    };

    return (
      <Box sx={{ p: 1, width: '100%' }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: '100%'
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
             <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="game manager tabs"
            >
                <Tab label="Panel" {...a11yProps(0)} />
                <Tab label="Members" {...a11yProps(2)} />
                <Tab label="Finance" {...a11yProps(3)} />
              </Tabs>

              </Box>

              <TabPanel index={0} value={value}>
                <AdminPanel />
              </TabPanel>
              <TabPanel index={1} value={value}>
                <Membership />
              </TabPanel>
              <TabPanel index={2} value={value}>
                <Finance />
              </TabPanel>
          </Box>
        </Container>
      </Box>
    );
  }
}

export default function Admin(props) {
  return <AdminPage {...props} />;
}
