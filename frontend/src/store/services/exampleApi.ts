import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const exampleApi = createApi({
  reducerPath: "exampleApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),

  endpoints: (builder) => ({
    getPosts: builder.query<any[], void>({
      query: () => "posts",
    }),

    getPost: builder.query<any, number>({
      query: (id) => `posts/${id}`,
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
} = exampleApi;
