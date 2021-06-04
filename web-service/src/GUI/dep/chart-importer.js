// document.addEventListener("DOMContentLoaded", () => {
    scriptImporter("./dep/chart.js");
    scriptImporter("./dep/moment.js");
    scriptImporter("./dep/chartjs-adapter-moment.js");
// });

function scriptImporter(link) {
    let newscript = document.createElement("script");
    newscript.setAttribute("src",link);
    console.log(document.head);
    document.head.appendChild(newscript);
}