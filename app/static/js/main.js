const EXTENCIONES = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
const api = "http://127.0.0.1:3000";
let imgContainer = document.getElementById("imgs");

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

const obtenerImgs = async () => {
  try {
    const response = await fetch('/getImg');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    imgContainer.innerHTML += `error en el servidor`;
  }
}


const deleteImg = (name) => {
  console.log(name);
  fetch(`/delete_img/${name}`)
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

const mostrarImg = async () => {
  const imgs = await obtenerImgs();
  imgs.forEach(element => {
    imgContainer.innerHTML += `
    <div class="gallery">
      ${element}
      <br>
      <button onclick="deleteImg('${element}')" type="button" class="btn-close btn-close-white position-absolute z-3" aria-label="Close"></button>
      <img src="../static/imgs/${element}" alt="imagen">
    </div>
    `
  });
}

mostrarImg();