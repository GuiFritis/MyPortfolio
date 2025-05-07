const url_params = new URLSearchParams(window.location.search);
if(url_params.has('section'))
{
    window.location.hash = "#"+url_params.get('section');
}
const tooltip = document.createElement('div');
const tooltip_pointer = document.createElement('div');


window.addEventListener('load', (event) => {
    switchLanguage(url_params.has('language')?url_params.get('language'):'en');
    loadTheme();
    loadDropdowns();
    createTooltip();
    assignateTooltips();
    playVideos();
});


window.addEventListener('scroll', (event) => {
    playVideos();
});

document.querySelectorAll('.audio-control > input').forEach((el,id) => el.addEventListener('change', unmuteVideo));

function loadTheme()
{
    let mode = window.matchMedia('(prefers-color-scheme: light)').matches;
    if(mode)
    {
        document.getElementById('theme-switch-checkbox').checked = true;
        document.body.classList.add('light');
    }
    else
    {      
        document.body.classList.add('dark');
    }
    document.getElementById('theme-switch-checkbox').addEventListener("change", switchLightMode);
    document.getElementById("favicon").href = "media/favicon_" + (mode ? "light" : "dark") + ".png";
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
    const tooltips_callers = document.querySelectorAll("[data-tooltip],[data-tooltip-pt]");
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
    if(ev.target.hasAttribute('data-tooltip')) {
        tooltip.innerText = ev.target.getAttribute('data-tooltip');
    } else {
        if(document.body.classList.contains("pt")) {
            tooltip.innerText = ev.target.getAttribute('data-tooltip-pt');
        } else {
            tooltip.innerText = ev.target.getAttribute('data-tooltip-en');
        }
    }
    tooltip.style.left = Math.min(
        Math.max(
            ev.target.getBoundingClientRect().left - tooltip.clientWidth/2 + ev.target.clientWidth/2,
            8
        ),
        document.body.clientWidth - tooltip.clientWidth/2 - 8
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
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
    else
    {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    }
    document.getElementById("favicon").href = "media/favicon_" + (ev.target.checked ? "light" : "dark") + ".png";
}

function openSection(section)
{
    let element = document.getElementById(section);
    window.scrollTo({
        top: element.offsetTop - 60,
        left: 0,
        behavior: "smooth"
    });
}

function switchLanguage(lang)
{
    document.body.classList.remove("pt","en");
    document.body.classList.add(lang);
    document.querySelector(".dropdown-language").classList.remove("open");
    hideTooltip();
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

function unmuteVideo(event){
    if(!event.target.checked){
        let ev = new Event("change");
        document.querySelectorAll('.audio-control > input').forEach((el,id) => {
            if(el != event.target){
                el.checked = true;
                el.dispatchEvent(ev);
            } 
        });
    }
    event.target.parentElement.setAttribute("data-tooltip", event.target.checked?"Ativar som":"Mutar som");
    event.target.parentElement.parentElement.previousSibling.previousSibling.muted = event.target.checked;
}