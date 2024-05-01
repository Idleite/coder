import type { FC } from "react";
import { useDashboard } from "modules/dashboard/useDashboard";
import { NotificationBannerView } from "./NotificationBannerView";

export const NotificationBanners: FC = () => {
  const dashboard = useDashboard();
  const notificationBanners = dashboard.appearance.config.notification_banners;

  return (
    <>
      {notificationBanners
        .filter((banner) => banner.enabled)
        .map(({ message, background_color }) => (
          <NotificationBannerView
            key={message}
            message={message}
            backgroundColor={background_color}
          />
        ))}
    </>
  );
};
