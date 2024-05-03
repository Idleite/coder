import type { FC } from "react";
import { useDashboard } from "modules/dashboard/useDashboard";
import { NotificationBannerView } from "./NotificationBannerView";

export const NotificationBanners: FC = () => {
  const dashboard = useDashboard();
  const notificationBanners = dashboard.appearance.notification_banners;

  return (
    <>
      {notificationBanners
        .filter((banner) => banner.enabled)
        .map((banner) => (
          <NotificationBannerView
            key={banner.message}
            message={banner.message}
            backgroundColor={banner.background_color}
          />
        ))}
    </>
  );
};
