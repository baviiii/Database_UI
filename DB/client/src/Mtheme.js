import React from "react";

import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { createTheme } from "@mui/material";


const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
};

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6600'
    }
  },

  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },

    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },

    MuiButton: {
      defaultProps: {
        size: "small"
      }
    }
  },
});