const url_params = new URLSearchParams(window.location.search);
if(url_params.has('section'))
{
    window.location.hash = "#"+url_params.get('section');
}
var mode = url_params.has('mode')?url_params.get('mode'):
    (window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
const language = url_params.has('language')?url_params.get('language'):'';
const tooltip = document.createElement('div');
const tooltip_pointer = document.createElement('div');


window.addEventListener('load', (event) => {
    loadTheme();
    loadDropdowns();
    createTooltip();
    openSection();
    assignateTooltips();
});


window.addEventListener('scroll', (event) => {
    playVideos();
});

document.querySelectorAll('video').forEach((el,id) => el.addEventListener('mouseover', unmuteVide));
document.querySelectorAll('video').forEach((el,id) => el.addEventListener('mouseout', muteVideo));

function loadTheme()
{
    if(mode == 'light')
    {
        document.getElementById('theme-switch-checkbox').checked = true;
        document.body.classList.add('light');
        document.body.classList.add('light');
    }
    else
    {      
        document.body.classList.add('dark');
    }
    document.getElementById('theme-switch-checkbox').addEventListener("change", switchLightMode);
    document.getElementById("favicon").href = "media/favicon_" + mode + ".png";
}

function loadDropdowns()
{
    const dropdowns = document.getElementsByClassName('dropdown-link');
    for (let i = 0; i < dropdowns.length; i++) {
        const element = dropdowns[i];
        element.addEventListener('click', function(ev){
            hideTooltip();
            element.parentElement.classList.toggle("open");
        });
    }
}

function createTooltip()
{
    tooltip.classList.add('tooltip');
    tooltip.id = 'tooltip';
    document.body.append(tooltip);
    tooltip_pointer.classList.add('tooltip-pointer');
    document.body.append(tooltip_pointer);
}

function assignateTooltips()
{
    const tooltips_callers = document.querySelectorAll("[data-tooltip]");
    for (let i = 0; i < tooltips_callers.length; i++) {  
        const element = tooltips_callers[i];   
        element.removeEventListener('mouseenter', showTooltip);
        element.removeEventListener('mouseleave', hideTooltip);

        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    }
}

function showTooltip(ev)
{
    tooltip.innerText = ev.target.getAttribute('data-tooltip');
    tooltip.style.left = Math.min(
        ev.target.getBoundingClientRect().left - tooltip.clientWidth/2 + ev.target.clientWidth/2,
        document.body.clientWidth - tooltip.clientWidth - 8
    ) + "px";
    tooltip_pointer.style.left = (ev.target.getBoundingClientRect().left + ev.target.clientWidth/2 - 3) + "px";
    if(ev.target.getBoundingClientRect().top <= tooltip.clientHeight + 30)
    {
        tooltip.style.top = (ev.target.getBoundingClientRect().top + ev.target.clientHeight + 4) + "px";
        tooltip_pointer.style.top = (ev.target.getBoundingClientRect().top + ev.target.clientHeight + 1) + "px";
        tooltip_pointer.style.rotate = "135deg";
    }
    else
    {
        tooltip.style.top = 
            (ev.target.getBoundingClientRect().top - ev.target.clientHeight/2 - tooltip.clientHeight + 1) + "px";
        tooltip_pointer.style.top = 
        (ev.target.getBoundingClientRect().top - ev.target.clientHeight/2) + "px";
        tooltip_pointer.style.rotate = "-45deg";
    }
    tooltip.classList.add('show');
    tooltip_pointer.classList.add('show');
}

function hideTooltip(ev)
{
    tooltip.classList.remove('show');
    tooltip_pointer.classList.remove('show');
}

function switchLightMode(ev)
{    
    if(ev.target.checked)
    {
        mode = 'light';
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
    else
    {
        mode = 'dark';
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    }
    addHistory();
    document.getElementById("favicon").href = "media/favicon_" + mode + ".png";
}

function openSection()
{
    let section = window.location.hash.substring(1);
    document.getElementById(section)?.scrollIntoView({ 
        behavior: "smooth" 
    });
}

function addHistory()
{
    history.pushState({page:1}, "section", `?mode=${mode}&language=${language}`);
}

function switchLanguage(lang)
{
    let section = window.location.hash.substring(1);
    document.location.href=`index${lang}.html?mode=${mode}&language=${lang}#${section}`;
}

function checkVisible(elm, offset) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < -offset || rect.top - viewHeight >= offset);
}

function playVideos()
{
    document.querySelectorAll("video").forEach((element, id) => {
        if(checkVisible(element, -230)) {
            element.parentElement.classList.add("on-view");
            element.play();
        } else {
            element.parentElement.classList.remove("on-view");
            element.pause();
        }
    });
}

function unmuteVide(event){
    event.target.muted = false;
}

function muteVideo(){
    event.target.muted = true;
}