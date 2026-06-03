import React, { useEffect, useRef } from "react";
import { useGetTilesDataQuery, useGetPanoFloorDataQuery } from "../../store/services/assetsApi";
import mapRenderInit from "../../render/minimap";
import panoRenderInit from "../../render/pano";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

export default function Map() {
  const { data: mapData, isLoading: isMapLoading, isError: isMapError }
    = useGetTilesDataQuery("cs16");
  const { data: panoData, isLoading: isPanoLoading, isError: isPanoError }
    = useGetPanoFloorDataQuery({
      panoName: "cs16",
      floor: 0,
      panoId: 0,
    });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const panoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapData || !mapContainerRef.current) {
      return;
    }

    const mapCleanup = mapRenderInit(
      "cs16",
      mapData,
      mapContainerRef.current
    );

    return () => {
      mapCleanup?.();
    };

  }, [mapData]);

  useEffect(() => {

    if (!panoData || !panoContainerRef.current) {
      return;
    }

    const panoCleanup = panoRenderInit(
      "cs16",
      panoData,
      panoContainerRef.current
    );

    return () => {
      panoCleanup?.();
    };

  }, [panoData]);

  const handleFullscreenClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  if (isMapLoading && isPanoLoading) {
    return <p>Loading...</p>;
  }

  if (isMapError && isPanoError) {
    return <p>Error occurred</p>;
  }

  return (
    <>
      <div className="background">
        <div className="gradient"></div>
      </div>

      <section className="navigation">
        <aside className="sidebar sidebar-right">
          <nav className="buttons">
              <ul className="buttons-top">
              <li>
                  <Button onClick={handleFullscreenClick}>
                  <img src="/static/images/fullscreen.svg" alt="Full Screen View mode" style={{
                      width: 20,
                  }} />
                  </Button>
              </li>
              <li>
                  <Button onClick={handleFullscreenClick}>
                  <img src="/static/images/share.svg" alt="Share to friends" style={{
                      width: 20,
                  }} />
                  </Button>
              </li>
              </ul>

              <ul className="buttons-bottom">
              <li>
                  <Button>
                  <img src="/static/images/clear.svg" alt="Clear parametres" style={{
                      width: 30,
                  }} />
                  </Button>
              </li>
              <li>
                  <Button>
                  <img src="/static/images/plus.svg" alt="Plus zoom" style={{
                      width: 20,
                  }} />
                  </Button>
              </li>
              <li>
                  <Button>
                  <img src="/static/images/minus.svg" alt="Minus zoom" style={{
                      width: 20,
                  }} />
                  </Button>
              </li>
              <li>
                  <Button href="/cs16">
                  <img src="/static/images/close.svg" alt="Close the Pano" style={{
                      width: 20,
                  }} />
                  </Button>
              </li>
              </ul>
          </nav>
        </aside>

        <aside className="sidebar sidebar-right--hidden">
          <section className="minipano">
            <Button className="sidebar-button--valume">
              <img src="/static/images/valume.svg" alt="Mark" style={{
                width: 24,
              }} />
            </Button>
            <Link to="/cs16">
              <div
                ref={mapContainerRef}
                className="minipano-container"
              />
            </Link>
          </section>
        </aside>
      </section>
      
      <div
        ref={panoContainerRef}
        className="map-container"
      />
    </>
  );
}