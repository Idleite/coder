import { type CSSObject, useTheme } from "@emotion/react";
import AddIcon from "@mui/icons-material/AddOutlined";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { type FC, useState } from "react";
import type { BannerConfig } from "api/typesGenerated";
import { ConfirmDialog } from "components/Dialogs/ConfirmDialog/ConfirmDialog";
import { EmptyState } from "components/EmptyState/EmptyState";
import { Stack } from "components/Stack/Stack";
import { NotificationBannerDialog } from "./NotificationBannerDialog";
import { NotificationBannerItem } from "./NotificationBannerItem";

interface NotificationBannerSettingsProps {
  notificationBanners: readonly BannerConfig[];
  onSubmit: (banners: readonly BannerConfig[]) => Promise<void>;
}

export const NotificationBannerSettings: FC<
  NotificationBannerSettingsProps
> = ({ notificationBanners, onSubmit }) => {
  const theme = useTheme();
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
      <div
        css={{
          borderRadius: 8,
          border: `1px solid ${theme.palette.divider}`,
          marginTop: 32,
          padding: 24,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h3
            css={{
              fontSize: 20,
              margin: 0,
              fontWeight: 600,
            }}
          >
            Notification Banners
          </h3>
          <Button onClick={() => addBanner()} startIcon={<AddIcon />}>
            New
          </Button>
        </Stack>
        <div
          css={{
            color: theme.palette.text.secondary,
            fontSize: 14,
            marginTop: 8,
          }}
        >
          Display message banners to all users.
        </div>

        <div css={[theme.typography.body2 as CSSObject, { paddingTop: 16 }]}>
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
                      onUpdate={async (banner) => {
                        const newBanners = updateBanner(i, banner);
                        await onSubmit(newBanners);
                      }}
                      onDelete={() => setDeletingBannerId(i)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

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
            setDeletingBannerId(null);
            await onSubmit(newBanners);
          }}
        />
      )}
    </>
  );
};
