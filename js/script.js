const theme = localStorage.getItem('theme');
if(theme == 'dark')
{
    document.getElementById('theme-switch-checkbox').setAttribute('checked', true);
}

function switchLightMode(input)
{    
    if(input.getAttribute('checked'))
    {
        localStorage.setItem('theme', 'dark');
    }
    else
    {
        localStorage.setItem('theme', 'light');
    }
}

function openSection(link)
{
    const request = new XMLHttpRequest();
    request.onload = function() {
        document.getElementById("page-content").innerHTML = this.responseText;
    }
    request.open("GET", link, true);
    request.send();
}