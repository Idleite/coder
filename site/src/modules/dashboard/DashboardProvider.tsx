import { createContext, type FC, type PropsWithChildren } from "react";
import { useQuery } from "react-query";
import { appearance } from "api/queries/appearance";
import { entitlements } from "api/queries/entitlements";
import { experiments } from "api/queries/experiments";
import type {
  AppearanceConfig,
  Entitlements,
  Experiments,
} from "api/typesGenerated";
import { Loader } from "components/Loader/Loader";

export interface DashboardValue {
  entitlements: Entitlements;
  experiments: Experiments;
  appearance: AppearanceConfig;
}

export const DashboardContext = createContext<DashboardValue | undefined>(
  undefined,
);

export const DashboardProvider: FC<PropsWithChildren> = ({ children }) => {
  const entitlementsQuery = useQuery(entitlements());
  const experimentsQuery = useQuery(experiments());
  const appearanceQuery = useQuery(appearance());

  const isLoading =
    !entitlementsQuery.data || !appearanceQuery.data || !experimentsQuery.data;

  if (isLoading) {
    return <Loader fullscreen />;
  }

  return (
    <DashboardContext.Provider
      value={{
        entitlements: entitlementsQuery.data,
        experiments: experimentsQuery.data,
        appearance: appearanceQuery.data,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
