var cur_section = '';

window.addEventListener('load', (event) => {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches)
    {
        document.getElementById('theme-switch-checkbox').setAttribute('checked', true);
        document.body.classList.add('dark');
    }
    else
    {        
        document.body.classList.add('light');
    }
    document.getElementById('theme-switch-checkbox').addEventListener("change", switchLightMode);

    openSection('/content/about_me.html');
});

function switchLightMode(ev)
{    
    if(ev.target.checked)
    {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    }
    else
    {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
}

function openSection(link)
{
    if(cur_section != link)
    {
        cur_section = link;
        const request = new XMLHttpRequest();
        request.onload = function() {
            document.getElementById("page-content").innerHTML = this.responseText;
        }
        request.onerror = function(e){console.log(e)}
        request.open("GET", link, false);
        request.send();
    }
}