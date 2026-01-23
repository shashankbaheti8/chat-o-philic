import { Avatar, Box, Typography, Paper } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Paper
      elevation={2}
      onClick={handleFunction}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#E8E8E8",
        cursor: "pointer",
        px: 2,
        py: 1,
        mb: 1.5,
        borderRadius: 2,
        transition: "0.3s",
        "&:hover": {
          backgroundColor: "#2C3E50",
          color: "#fff",
        },
      }}
    >
      <Avatar
        src={user.pic}
        alt={user.name}
        sx={{ width: 36, height: 36, mr: 2 }}
      />
      <Box>
        <Typography variant="body1" fontWeight={500}>
          {user.name}
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserListItem;
