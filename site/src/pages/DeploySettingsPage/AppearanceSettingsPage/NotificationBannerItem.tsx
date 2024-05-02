import type { FC } from "react";
import type { BannerConfig } from "api/typesGenerated";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Edit from "@mui/icons-material/Edit";
import { Checkbox, IconButton } from "@mui/material";
import type { Interpolation, Theme } from "@emotion/react";

interface NotificationBannerItemProps {
  enabled: boolean;
  backgroundColor?: string;
  message?: string;
  onUpdate: (banner: Partial<BannerConfig>) => void;
  onEdit: () => void;
}

export const NotificationBannerItem: FC<NotificationBannerItemProps> = ({
  enabled,
  backgroundColor = "#004852",
  message,
  onUpdate,
  onEdit,
}) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          size="small"
          checked={enabled}
          onClick={() => onUpdate({ enabled: !enabled })}
        />
      </TableCell>

      <TableCell css={!enabled && styles.disabled}>{message}</TableCell>

      <TableCell>
        <div css={styles.colorSample} style={{ backgroundColor }}></div>
      </TableCell>

      <TableCell>
        <IconButton size="small" onClick={onEdit}>
          <Edit fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const styles = {
  disabled: (theme) => ({
    color: theme.roles.inactive.fill.outline,
  }),

  colorSample: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
} satisfies Record<string, Interpolation<Theme>>;
