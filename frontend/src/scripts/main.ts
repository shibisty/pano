import render from './render';

window.onload = () => {
    fetch(`/static/assets/${window.TILES_PATH}/tiles.json`)
        .then(r => r.json())
        .then(data => {
            render(data);
        });

    document.querySelectorAll(".navigation--top-footer--button").forEach(link => {
        const icons = link.querySelectorAll("svg");

        icons.forEach(icon => {
            icon.style.display = "none";
        });

        const randomIndex = Math.floor(Math.random() * icons.length);

        icons[randomIndex].style.display = "inline-block";
    });
};
