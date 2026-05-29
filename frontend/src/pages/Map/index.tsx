import React, { useEffect, useRef } from "react";
import Header from "../../components/Header";
import { useGetTilesDataQuery } from "../../store/services/assetsApi";
import mapRenderInit from "../../render/map";

export default function Map() {
  const { data, isLoading, isError } = useGetTilesDataQuery("cs16");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!data || !containerRef.current) {
      return;
    }

    const cleanup = mapRenderInit(
      "cs16",
      data,
      containerRef.current
    );

    return () => {
      cleanup?.();
    };

  }, [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error occurred</p>;
  }

  return (
    <>
      <Header />
      <div className="gradient"></div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%"
        }}
      />
    </>
  );
}