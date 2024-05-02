import { useTheme } from "@emotion/react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { type FC, useState } from "react";
import { BlockPicker } from "react-color";
import type { BannerConfig, UpdateAppearanceConfig } from "api/typesGenerated";
import {
  Badges,
  DeprecatedBadge,
  DisabledBadge,
  EnterpriseBadge,
  EntitledBadge,
} from "components/Badges/Badges";
import { Stack } from "components/Stack/Stack";
import colors from "theme/tailwindColors";
import { getFormHelpers } from "utils/formUtils";
import { Fieldset } from "../Fieldset";
import { Header } from "../Header";
import { NotificationBannerItem } from "./NotificationBannerItem";
import { EmptyState } from "components/EmptyState/EmptyState";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/AddOutlined";
import { NotificationBannerDialog } from "./NotificationBannerDialog";
import { DeleteDialog } from "components/Dialogs/DeleteDialog/DeleteDialog";
import { ConfirmDialog } from "components/Dialogs/ConfirmDialog/ConfirmDialog";

interface NotificationBannerSettingsProps {
  notificationBanners: readonly BannerConfig[];
  onSubmit: (banners: readonly BannerConfig[]) => Promise<void>;
}

export const NotificationBannerSettings: FC<
  NotificationBannerSettingsProps
> = ({ notificationBanners, onSubmit }) => {
  const [banners, setBanners] = useState(notificationBanners);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [deletingBannerId, setDeletingBannerId] = useState<number | null>(null);

  const addBanner = () => {
    setBanners([
      ...banners,
      { enabled: true, message: "", background_color: "#004852" },
    ]);
    setEditingBannerId(banners.length);
  };

  const updateBanner = (i: number, banner: Partial<BannerConfig>) => {
    const newBanners = [...banners];
    newBanners[i] = { ...banners[i], ...banner };
    setBanners(newBanners);
    return newBanners;
  };

  const removeBanner = (i: number) => {
    const newBanners = [...banners];
    newBanners.splice(i, 1);
    setBanners(newBanners);
    return newBanners;
  };

  const editingBanner = editingBannerId !== null && banners[editingBannerId];
  const deletingBanner = deletingBannerId !== null && banners[deletingBannerId];

  return (
    <>
      <Fieldset
        title={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <div>Notification Banners</div>
            <Button onClick={() => addBanner()} startIcon={<AddIcon />}>
              New
            </Button>
          </Stack>
        }
        subtitle="Display message banners to all users."
        onSubmit={() => onSubmit(banners)}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="1%">Enabled</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Color</TableCell>
                <TableCell width="1%" />
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.length < 1 ? (
                <TableCell colSpan={999}>
                  <EmptyState message="No notification banners" />
                </TableCell>
              ) : (
                banners.map((banner, i) => (
                  <NotificationBannerItem
                    key={banner.message}
                    enabled={banner.enabled}
                    backgroundColor={banner.background_color}
                    message={banner.message}
                    onEdit={() => setEditingBannerId(i)}
                    onUpdate={(banner) => {
                      updateBanner(i, banner);
                      onSubmit(banners);
                    }}
                    onDelete={() => setDeletingBannerId(i)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fieldset>
      {editingBanner && (
        <NotificationBannerDialog
          banner={editingBanner}
          onCancel={() => setEditingBannerId(null)}
          onUpdate={async (banner) => {
            const newBanners = updateBanner(editingBannerId, banner);
            setEditingBannerId(null);
            await onSubmit(newBanners);
          }}
        />
      )}
      {deletingBanner && (
        <ConfirmDialog
          type="delete"
          open
          title="Delete this banner?"
          description={deletingBanner.message}
          onClose={() => setDeletingBannerId(null)}
          onConfirm={async () => {
            const newBanners = removeBanner(deletingBannerId);
            setEditingBannerId(null);
            await onSubmit(newBanners);
          }}
        />
      )}
    </>
  );
};
