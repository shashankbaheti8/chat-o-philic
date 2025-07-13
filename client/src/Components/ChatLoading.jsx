import { Stack, Skeleton } from "@mui/material";

const ChatLoading = () => {
  return (
    <Stack spacing={1}>
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={45}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Stack>
  );
};

export default ChatLoading;
