import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen} size="small">
          <VisibilityIcon />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "2rem",
            fontFamily: "Poppins",
            backgroundColor: "#F4F6F8",
          }}
        >
          {user.name}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            padding: 4,
            backgroundColor: "#F4F6F8",
          }}
        >
          <Avatar
            alt={user.name}
            src={user.pic}
            sx={{ width: 150, height: 150 }}
          />
          <Typography
            sx={{
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
              fontFamily: "Poppins",
              color: "#333",
            }}
          >
            Email: {user.email}
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            paddingBottom: 2,
            backgroundColor: "#F4F6F8",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              backgroundColor: "#E67E22",
              "&:hover": { backgroundColor: "#d35400" },
              fontFamily: "Poppins",
              borderRadius: 2,
              paddingX: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileModal;
