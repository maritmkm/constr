import React from 'react';
import { Badge } from '../ui/badge';
import { EmployeeStatus, WorkStatus } from '../../types';

export interface StatusBadgeProps {
  status: EmployeeStatus | WorkStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant="active">ACTIVE</Badge>;
    case 'INACTIVE':
      return <Badge variant="inactive">INACTIVE</Badge>;
    case 'ON_LEAVE':
      return <Badge variant="on_leave">ON LEAVE</Badge>;
    case 'ONGOING':
      return <Badge variant="ongoing">ONGOING</Badge>;
    case 'UPCOMING':
      return <Badge variant="upcoming">UPCOMING</Badge>;
    case 'COMPLETED':
      return <Badge variant="completed">COMPLETED</Badge>;
    case 'CANCELLED':
      return <Badge variant="cancelled">CANCELLED</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
