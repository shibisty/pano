import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

export default function Pano() {

    const handleFullscreenClick = () => {

    };

    return (
        <div className="pano-container">
            <section className="navigation">
                <aside className="sidebar sidebar-right">
                <nav className="buttons">
                    <ul className="buttons-top">
                    <li>
                        <Button className="" onClick={handleFullscreenClick}>
                        <img src="/static/images/fullscreen.svg" alt="Full Screen View mode" style={{
                            width: 20,
                        }} />
                        </Button>
                    </li>
                    <li>
                        <Button className="" onClick={handleFullscreenClick}>
                        <img src="/static/images/share.svg" alt="Share to friends" style={{
                            width: 20,
                        }} />
                        </Button>
                    </li>
                    </ul>

                    <ul className="buttons-bottom">
                    <li>
                        <Button className="">
                        <img src="/static/images/clear.svg" alt="Clear parametres" style={{
                            width: 30,
                        }} />
                        </Button>
                    </li>
                    <li>
                        <Button className="">
                        <img src="/static/images/plus.svg" alt="Plus zoom" style={{
                            width: 20,
                        }} />
                        </Button>
                    </li>
                    <li>
                        <Button className="">
                        <img src="/static/images/minus.svg" alt="Minus zoom" style={{
                            width: 20,
                        }} />
                        </Button>
                    </li>
                    <li>
                        <Button className="">
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
                    {/* <div
                    ref={panoContainerRef}
                    className="minipano-container"
                    /> */}
                </section>
                </aside>
            </section>
        </div>
    );
}
