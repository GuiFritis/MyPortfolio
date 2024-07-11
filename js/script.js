const url_params = new URLSearchParams(window.location.search);
var cur_section = url_params.has('section')?url_params.get('section'):'./content/about_me.html';
var mode = url_params.has('mode')?url_params.has('mode'):
    (window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');

window.addEventListener('load', (event) => {
    loadTheme();
    loadDropdowns();
    loadToolips();
    openSection(cur_section);
});

function loadTheme()
{
    if(mode == 'light')
    {
        document.getElementById('theme-switch-checkbox').setAttribute('checked', true);
        document.body.classList.add('light');
    }
    else
    {      
        document.body.classList.add('dark');
    }
    document.getElementById('theme-switch-checkbox').addEventListener("change", switchLightMode);
}

function loadDropdowns()
{
    const dropdowns = document.getElementsByClassName('dropdown-link');
    for (let i = 0; i < dropdowns.length; i++) {
        const element = dropdowns[i];
        element.addEventListener('click', function(ev){
            element.parentElement.classList.toggle("open");
        });
    }
}

function loadToolips()
{
    const tooltips = document.querySelectorAll("[data-tooltip]");
    for (let i = 0; i < tooltips.length; i++) {
        const element = tooltips[i];
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        document.body.append(tooltip);
        element.addEventListener('mouseenter', function(ev){
            tooltip.innerText = element.getAttribute('data-tooltip');
            tooltip.style.left = Math.min(
                element.getBoundingClientRect().left - element.clientWidth/2,
                document.body.clientWidth - tooltip.clientWidth - 8
            ) + "px";
            if(element.getBoundingClientRect().top <= tooltip.clientHeight + 30)
            {
                tooltip.style.bottom = "";
                tooltip.style.top = (element.getBoundingClientRect().top + element.clientHeight + 5) + "px";
            }
            else
            {
                tooltip.style.top = "";
                tooltip.style.bottom = 
                    (document.body.clientHeight - element.getBoundingClientRect().top - element.clientHeight + 5) + "px";
            }
            tooltip.classList.add('show');

        });
        element.addEventListener('mouseleave', function(ev){
            tooltip.classList.remove('show');
        });
    }
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
}

function openSection(link, a = null)
{
    if(a)
    {
        document.querySelector(".nav-item.active").classList.remove("active");
        a.classList.add("active");
    }
    cur_section = link;
    const request = new XMLHttpRequest();
    request.onload = function() {
        document.getElementById("page-content").innerHTML = this.responseText;
    }
    request.onerror = function(e){console.log(e)}
    request.open("GET", link, false);
    request.send();
}