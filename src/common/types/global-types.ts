
export const getPermissionDescription = (permission: string) => {
    switch (permission) {
      case 'administrator':
        return 'Full control of account.';
      case 'editor':
        return 'Manage all Patients account. Cannot manage Administrator users.';
      case 'analyst':
        return 'Manage Patients report. Includes Viewer role.';
      case 'viewer':
        return 'See report data and configuration settings for Patients.';
      default:
        return '';
    }
  };