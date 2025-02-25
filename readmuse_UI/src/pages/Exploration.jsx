import React from "react";
import Livres from "../components/Livres";
import { Box, Typography } from "@mui/material";
import "../styles/Livres.css";


const Exploration = () => {
  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        Explorer les Livres
      </Typography>

      <Livres />
    </Box>
  );
};

export default Exploration;
