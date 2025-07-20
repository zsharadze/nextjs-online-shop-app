export const getBGOnOrderStatus = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-primary";
    case "Shipped":
      return "bg-warning text-dark";
    case "Completed":
      return "bg-success";
    case "Canceled":
      return "bg-danger";
  }
};
