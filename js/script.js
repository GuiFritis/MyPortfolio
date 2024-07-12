const url_params = new URLSearchParams(window.location.search);
var section = url_params.has('section')?url_params.get('section'):'about_me';
var mode = url_params.has('mode')?url_params.has('mode'):
    (window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
const language = url_params.has('language')?url_params.get('language'):'';

window.addEventListener('load', (event) => {
    loadTheme();
    loadDropdowns();
    loadToolips();
    openSection(section);
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
            hideTooltip();
            element.parentElement.classList.toggle("open");
        });
    }
}

function loadToolips()
{
    const tooltips_callers = document.querySelectorAll("[data-tooltip]");
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.id = 'tooltip';
    document.body.append(tooltip);
    const tooltip_pointer = document.createElement('div');
    tooltip_pointer.classList.add('tooltip-pointer');
    document.body.append(tooltip_pointer);
    for (let i = 0; i < tooltips_callers.length; i++) {  
        const element = tooltips_callers[i];      
        element.addEventListener('mouseenter', function(ev){
            tooltip.innerText = element.getAttribute('data-tooltip');
            tooltip.style.left = Math.min(
                element.getBoundingClientRect().left - tooltip.clientWidth/2 + element.clientWidth/2,
                document.body.clientWidth - tooltip.clientWidth - 8
            ) + "px";
            tooltip_pointer.style.left = (element.getBoundingClientRect().left + element.clientWidth/2 - 3) + "px";
            if(element.getBoundingClientRect().top <= tooltip.clientHeight + 30)
            {
                tooltip.style.top = (element.getBoundingClientRect().top + element.clientHeight + 3) + "px";
                tooltip_pointer.style.top = (element.getBoundingClientRect().top + element.clientHeight) + "px";
                tooltip_pointer.style.rotate = "135deg";
            }
            else
            {
                tooltip.style.top = 
                    (element.getBoundingClientRect().top - element.clientHeight/2 - tooltip.clientHeight) + "px";
                tooltip_pointer.style.top = 
                (element.getBoundingClientRect().top - element.clientHeight/2 - 1) + "px";
                tooltip_pointer.style.rotate = "-45deg";
            }
            tooltip.classList.add('show');
            tooltip_pointer.classList.add('show');
        });
        element.addEventListener('mouseleave', function(ev){
            tooltip.classList.remove('show');
            tooltip_pointer.classList.remove('show');
        });
    }
}

function hideTooltip()
{
    document.getElementById("tooltip").classList.remove('show');
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

function openSection(link)
{
    document.querySelector('.nav-item.active').classList.remove('active');
    document.querySelector('.nav-item[data-section='+link+']').classList.add('active');
    section = link;
    link = './content/' + section + language + '.html';
    const request = new XMLHttpRequest();
    request.onload = function() {
        document.getElementById('page-content').innerHTML = this.responseText;
    }
    request.onerror = function(e){console.log(e)}
    request.open('GET', link, false);
    request.send();
}

function switchLanguage(lang)
{
    document.location.href=`index${lang}.html?mode=${mode}&section=${section}&language=${lang}`;
}