import { Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Chip
      label={
        <>
          {user.name}
          {admin === user._id && (
            <span style={{ fontWeight: 500 }}> (Admin)</span>
          )}
        </>
      }
      onClick={handleFunction}
      onDelete={handleFunction}
      deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
      sx={{
        m: 0.5,
        fontSize: 12,
        backgroundColor: "#9b59b6",
        color: "#fff",
        "& .MuiChip-deleteIcon": { color: "#f5f5f5" },
        borderRadius: "16px",
        px: 1.5,
      }}
    />
  );
};

export default UserBadgeItem;
