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
            mostrarImg();
            file.value = "";
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
  fetch(`/delete_img/${name}`)
    .then(response =>{
      if (response.ok) {
        alert('Imagen se elimino exitosamente');
        mostrarImg();
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
  const imgContainer = document.getElementById("imgs");
  imgContainer.innerHTML = "";
  imgs.forEach((element) => {
    const modalId = `eModal-${element}`; //
    imgContainer.innerHTML += `
    <div class="gallery">
      <button type="button" class="bg-danger btn-close position-absolute z-3" aria-label="Close" data-toggle="modal" data-target="#${modalId}"></button>
      <img src="../static/imgs/${element}" alt="imagen">
    </div>

    <div id="${modalId}" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">¿Seguro que quiere eliminarlo?</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-footer">
            <button onclick="deleteImg('${element}')" type="button" class="btn btn-danger" data-dismiss="modal">Eliminar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    `
  });
}

mostrarImg();