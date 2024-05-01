import { useTheme } from "@emotion/react";
import Delete from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { FC } from "react";
import { BlockPicker } from "react-color";
import type { BannerConfig } from "api/typesGenerated";
import Switch from "@mui/material/Switch";

interface NotificationBannerItemProps {
  enabled: boolean;
  backgroundColor?: string;
  message?: string;
  onRemove: () => void;
  onUpdate: (banner: Partial<BannerConfig>) => void;
}

export const NotificationBannerItem: FC<NotificationBannerItemProps> = ({
  enabled,
  backgroundColor,
  message,
  onRemove,
  onUpdate,
}) => {
  const theme = useTheme();

  return (
    <div>
      <div>
        <Switch
          checked={enabled}
          onChange={() => onUpdate({ enabled: !enabled })}
          data-testid="switch-service-banner"
        />
        <Button onClick={onRemove}>
          <Delete />
        </Button>
      </div>
      <div css={{ backgroundColor }}>{message}</div>

      <TextField
        // {...serviceBannerFieldHelpers("message", {
        //   helperText:
        //     ,
        // })}
        onChange={(event) => onUpdate({ message: event.target.value })}
        defaultValue={message}
        helperText="Markdown bold, italics, and links are supported."
        fullWidth
        label="Message"
        multiline
        inputProps={{
          "aria-label": "Message",
        }}
      />

      <button
        type="button"
        css={{
          backgroundColor,
          width: 24,
          height: 24,
          outline: "none",
          border: "none",
          borderRadius: 4,
        }}
      ></button>
      <details>
        <summary>Background Color</summary>
        <BlockPicker
          color={backgroundColor}
          onChange={async (color) => {
            // TODO: preview the color?
            onUpdate({ background_color: color.hex });
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
      </details>
    </div>
  );
};
