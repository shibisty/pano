import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import hostConfig from "../../config/backend";

export const lunaApi = createApi({
  reducerPath: "lunaApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "${hostConfig.proto}://${hostConfig.backendUrl}:${hostConfig.backendPort}/",
  }),

  endpoints: (builder) => ({
    // getPosts: builder.query<any[], void>({
    //   query: () => "posts",
    // }),

    // getPost: builder.query<any, number>({
    //   query: (id) => `posts/${id}`,
    // }),
  }),
});

export const {
  // useGetPostsQuery,
  // useGetPostQuery,
} = lunaApi;
