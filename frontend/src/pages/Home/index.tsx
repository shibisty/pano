import React from "react";
import Header from "../../components/Header";
// import { useGetPostsQuery } from '../../store/services/exampleApi';

export default function Home() {
  // const { data, isLoading, isError } = useGetPostsQuery();

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error occurred</p>;

  return (
    <>
      <Header />
      <p>Just home</p>
    </>
  );
}
