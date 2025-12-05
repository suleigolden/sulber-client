

export const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "ACCEPTED":
        return "blue";
      case "IN_PROGRESS":
        return "purple";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "gray";
    }
  };