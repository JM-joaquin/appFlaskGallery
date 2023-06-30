const EXTENCIONES = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
const api = "http://127.0.0.1:3000";

const addImg = () => {
    const file = document.getElementById("file-img");
    const archivo = file.files[0];
    if (archivo) {
        const datos = new FormData();
        datos.append('file', archivo);
  
        fetch('/add_img', {
          method: 'POST',
          body: datos,
        })
        .then(response => {
          if (response.ok) {
            alert('Imagen enviada exitosamente');
          } else {
            throw new Error('Error al enviar la imagen');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
}

function obtenerImgs() {
  const imgContainer = document.getElementById("imgs");
  fetch('/getImg')
    .then(response => response.json())
    .then(data => {
      data.forEach(element => {
        imgContainer.innerHTML += `
        <div class="gallery">
          <button onclick="deleteImg(${element})" type="button" class="btn-close btn-close-white position-absolute z-3" aria-label="Close"></button>
          <img src="../static/imgs/${element}" alt="imagen">
        </div>
        `
      });
    })
    .catch(error => console.error('Error:', error));
}

obtenerImgs();

const deleteImg = (name) => {
  console.log(name);
  fetch(`/delte_img/${name}`)
    .then(response =>{
      if (response.ok) {
        alert('Imagen se elimino exitosamente');
      } else {
        throw new Error('Error al eliminar la imagen');
      }
    })
    .catch(error => {
      console.error(error);
    });
}