const socket = io();
window.onload=function(){
    document.getElementById('btn').addEventListener('click',function(){
        name=document.getElementById('nom').value;
        socket.emit('search',name);
        let loader = document.getElementById('loader');
        loader.style.display="block";
    })   
}

/*Client*/

socket.on('complet',async function(elements){
    let personatge = elements[0];
    let marvel = document.getElementById("marvel");
    marvel.innerHTML="";
    socket.emit('comics',personatge.id)
    
})
socket.on('comics_response', function(resposta){
    resposta.forEach(comic=>{
        marvel.innerHTML += "<div class='box'>"+
        "<div class='box-front'><img src='"+comic.thumbnail.path+"."+comic.thumbnail.extension+"'><p>" +comic.title+ "</p></div>"+
        "<div class='box-back'><h1>Datos</h1><p>Precio: "+comic.prices[0].price+"$</p><p> Fecha: "+comic.dates[0].date.split("T")[0]+"</p></div></div>";
    })
    setTimeout((()=>{
        let marvel = document.getElementById("marvel");
        marvel.style.display="grid";
        console.log("ready")
        document.getElementById('loader').style.display="none";
        let frontBox = document.getElementsByClassName('box-front');
        let backBox = document.getElementsByClassName('box-back');
        for(let i=0;i<frontBox.length;i++){ 
            frontBox[i].addEventListener("click", (()=>{
                frontBox[i].style.display="none";
                backBox[i].style.display="flex";
            }));
        }

        for(let i=0;i<backBox.length;i++){ 
            backBox[i].addEventListener("click", (()=>{
                backBox[i].style.display="none";
                frontBox[i].style.display="block";
            }));
        }
    }),500)
})