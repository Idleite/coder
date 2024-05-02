import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { type Interpolation, type Theme, useTheme } from "@emotion/react";
import { useFormik } from "formik";
import { type FC, useState } from "react";
import {
  Dialog,
  DialogActionButtons,
  type DialogActionButtonsProps,
} from "components/Dialogs/Dialog";
import { BannerConfig } from "api/typesGenerated";
import { readableForegroundColor } from "utils/colors";
import TextField from "@mui/material/TextField";
import { BlockPicker } from "react-color";
import { getFormHelpers } from "utils/formUtils";
import { NotificationBannerView } from "modules/dashboard/NotificationBanners/NotificationBannerView";

interface NotificationBannerDialogProps {
  banner: BannerConfig;
  onCancel: () => void;
  onUpdate: (banner: Partial<BannerConfig>) => Promise<void>;
  onRemove: () => Promise<void>;
}

export const NotificationBannerDialog: FC<NotificationBannerDialogProps> = ({
  banner,
  onCancel,
  onUpdate,
  onRemove,
}) => {
  const theme = useTheme();

  const bannerForm = useFormik<{
    message: string;
    background_color: string;
  }>({
    initialValues: {
      message: banner.message ?? "",
      background_color: banner.background_color ?? "#004852",
    },
    onSubmit: (banner) => onUpdate(banner),
  });
  const bannerFieldHelpers = getFormHelpers(bannerForm);

  return (
    <Dialog onClose={onCancel} open>
      <div css={{ padding: "8px 16px", width: 600 }}>
        <h3>Editing notification banner</h3>

        <div css={{ position: "fixed", top: 0, left: 0, right: 0 }}>
          <NotificationBannerView
            message={bannerForm.values.message}
            backgroundColor={bannerForm.values.background_color}
          />
        </div>
        <h4 css={styles.settingName}>Message</h4>
        <TextField
          {...bannerFieldHelpers("message", {
            helperText: "Markdown bold, italics, and links are supported.",
          })}
          fullWidth
          label="Message"
          multiline
          inputProps={{
            "aria-label": "Message",
          }}
        />
        <h4 css={styles.settingName}>Background color</h4>
        <BlockPicker
          color={bannerForm.values.background_color}
          onChange={async (color) => {
            await bannerForm.setFieldValue("background_color", color.hex);
          }}
          triangle="hide"
          colors={["#004852", "#D65D0F", "#4CD473", "#D94A5D", "#5A00CF"]}
          styles={{
            default: {
              input: {
                color: "white",
                backgroundColor: theme.palette.background.default,
              },
              body: {
                backgroundColor: "black",
                color: "white",
              },
              card: {
                backgroundColor: "black",
              },
            },
          }}
        />
      </div>
      <Button onClick={() => onRemove()}>Delete</Button>

      <DialogActions>
        <DialogActionButtons
          cancelText="Cancel"
          confirmLoading={bannerForm.isSubmitting}
          confirmText="Update"
          disabled={bannerForm.isSubmitting}
          onCancel={onCancel}
          onConfirm={bannerForm.handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

const styles = {
  settingName: (theme) => ({
    marginTop: 0,
    marginBottom: 8,
    color: theme.palette.text.primary,
    fontSize: 16,
    lineHeight: "150%",
    fontWeight: 600,
  }),
} satisfies Record<string, Interpolation<Theme>>;
