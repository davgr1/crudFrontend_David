import {
    getCategories,
    updateCategory,
    deleteCategory,
    createCategory
} from "../services/categoryService.js";
 
//evento a todo el contenido de la pagina
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#categoriesTable tbody"); //id en html linea 49
    const form = document.getElementById("categoryForm");
    const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
    const lbModal = document.getElementById("categoryModalLabel");
    const btnAdd = document.getElementById("btnAddCategory");
 
    loadCategories(); //Despues de cargar las constantes cargamos los registros
 
    btnAdd.addEventListener("click", () => {
        form.reset();
        form.categoryId.value = "";
        lbModal.textContent = "Agregar Categoria";
        modal.show();
    });
 
    form.addEventListener("submit", async (e) => { // esta "e" significa evento, especificamente submit //ponemos async para poder acceder a las funciones del services
        e.preventDefault(); //evita que el formulario se envie
        const id = form.categoryId.value; //se obtiene el ID del form
        const data = {
            nombreCategoria: form.categoryName.value.trim(),
            descripcion: form.categoryDescription.value.trim()
        };
 
        try {
            if (id) {
                await updateCategory(id, data);
            }
            else {
                await createCategory(data);
            }
            modal.hide();
            await loadCategories();
        }
        catch (err) {
            console.error("Error al guardar la categoria: ", err);
        }
    });
 
    async function loadCategories() {
        try {
            const categories = await getCategories();
 
            tableBody.innerHTML = ''; //vaciamos el tbody
 
            //Verificar si NO hay categorias registradas
            if (!categories || categories.length == 0) {
                tableBody.innerHTML = '<td colspan = "5"> Actualmente no hay registros </td>';
                return; // El codigo deha de ejecutarse
            }
            categories.forEach((cat) => {
                const tr = document.createElement("tr");//Definimos un TR en JS
                tr.innerHTML = `
                    <td>${cat.idCategoria}</td>
                    <td>${cat.nombreCategoria}</td>
                    <td>${cat.descripcion || "Descripcion no asignada"}</td>
                    <td>${cat.fechaCreacion || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-square-pen">
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                            </svg>
                        </button>
 
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-trash">
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                <path d="M3 6h18"/>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                `;
 
                //funcionalidad para boton de editar categoria
                tr.querySelector(".edit-btn").addEventListener("click", ()=>{
 
                    //pasamos los datos del JSON a los campos del formulario
                    form.categoryId.value = cat.idCategoria;
                    form.categoryName.value = cat.nombreCategoria;
                    form.categoryDescription.value = cat.descripcion;
 
                    //titulo del form
                    lbModal.textContent = "Editar Categoria";
                    modal.show();
                });
 
 
                //funcionalidad para boton de eliminar categoria
                tr.querySelector(".delete-btn").addEventListener("click", async () => {
                    if (confirm("¿Desea eliminar la categoría?")) {
                      await deleteCategory(cat.idCategoria);
                      await loadCategories();
                    }
                  });
                 
                tableBody.appendChild(tr); // al <tbody> le agrega el <tr> creado
            });
        }
        catch (err) {
            console.error("Error al cargar las categorias: ", err);
 
        }
    }
})