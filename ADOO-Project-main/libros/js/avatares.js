var imagenes = ['img/avi1.png','img/avi2.png','img/avi3.png','img/avi4.png','img/avi5.png','img/avi6.png',
'img/avi7.png','img/avi8.png','img/avi9.png','img/avi10.png'],
    cont = 0;

function carrusel(imagen){
   imagen.addEventListener('click', e => {
        let atras = imagen.querySelector('.atras'),
            adelante = imagen.querySelector('.adelante'),
            img = imagen.querySelector('img'),
            tgt = e.target;
            

        if (tgt == atras){
            if (cont > 0){
                img.src = imagenes [cont -1];
                cont--;
            } else {
                img.src = imagenes [imagenes.length -1 ];
                cont = imagenes.length -1;
            }
        }   else if (tgt == adelante){
            if (cont < imagenes.length - 1){
                img.src = imagenes [cont + 1];
                cont++;
            } else {
                img.src = imagenes [0];
                cont = 0;
            }
        }  
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let imagen = document.querySelector('.imagen');
    carrusel(imagen);
});