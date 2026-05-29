import React, { useEffect, useRef } from "react";
import Header from "../../components/Header";
import { useGetPanoFloorDataQuery } from "../../store/services/assetsApi";
import panoRenderInit from "../../render/pano";

export default function Pano() {
  const { data, isLoading, isError } = useGetPanoFloorDataQuery({ panoName: "cs16", floor: 0, panoId: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {

    if (!data || !containerRef.current) {
      return;
    }

    const cleanup = panoRenderInit(
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
