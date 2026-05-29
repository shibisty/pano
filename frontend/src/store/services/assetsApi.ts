import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetsApi = createApi({
  reducerPath: "assetsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),

  endpoints: (builder) => ({
    getTilesData: builder.query<any, string>({
      query: (mapName) => `/assets/maps/${mapName}/tiles.json`,
    }),
    getPanoData: builder.query<any, string>({
      query: (panoName) => `/assets/pano/${panoName}/data.json`,
    }),
    getPanoFloorData: builder.query<any, any>({
      query: (data) => `/assets/pano/${data.panoName}/${data.floor}/${data.panoId}/tiles.json`,
    }),
  }),
});

export const {
  useGetTilesDataQuery,
  useGetPanoDataQuery,
  useGetPanoFloorDataQuery,
} = assetsApi;
