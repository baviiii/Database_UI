import React from "react";

import { Box, Typography, Container } from "@mui/material";

/**
 * Stateless react components that is rendered when the base route is called. /
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Home() {
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
          <Typography variant="h6" component="div">
            Kokatha Membership Database
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}