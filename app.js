//para crear solicitud base de datos se utiliza el objeto indexedDb. El .results es labase de datos
//luego el metodo open("abrir/crear base de datos","version")
//luego upgradeneeded, para verificar que no este creada, en caso de que no este creada

//para crear almacen de objetos se utiliza createObjectStore("objeto","key") en la base de datos

//para almacenar objetos se utiliza el metodo transaction() y en que almacen se utilizaria y en que modo, readwrite o readonly (leer y escribir o leer solamente)
//luego se utiliza objectStore con el almacen a utilizar para dar permisos

//y el add(objeto) para añadir el objeto

//para leer los objetos se utilizan los mismos metodos que para crearlos pero tambien se utiliza el metodo openCursor() para leer

//para modificar objetos es igual que al agregar add pero con put(objeto,key) si el objeto no existe lo crea, si existe la modifica

//para eliminar se utiliza delete(key)

const IDBRequest = indexedDB.open("database",1) //window.indexedDB

IDBRequest.addEventListener("upgradeneeded",()=>{
    const db = IDBRequest.result
    db.createObjectStore("nombres",{
        autoIncrement: true
    })
})

IDBRequest.addEventListener("success", ()=>{
    leerObjeto();
})

IDBRequest.addEventListener("error",()=>{
    console.log("ah ocurrido un error");
})

document.getElementById("add").addEventListener("click", ()=>{
    let nombre = document.getElementById("nombre").value
    if (nombre.length > 0) {
        if (document.querySelector(".posible") != undefined) {
            if (confirm("Hay elementos sin guardar ¿Quieres continuar?")) {
                addObjeto({nombre})
                leerObjeto()
            }
        } else {
            addObjeto({nombre})
            leerObjeto()
        }
    }
})

const addObjeto = (objeto)=>{
    const IDBData = getIDBData("readwrite")
    IDBData.add(objeto)
}

const leerObjeto = ()=>{
    const IDBData = getIDBData("readonly")
    const cursor = IDBData.openCursor()
    document.querySelector(".contenedor-nombres").innerHTML = ""
    const fragment = document.createDocumentFragment()
    cursor.addEventListener("success",()=>{
        if (cursor.result) {
            let elemento = nombresHTML(cursor.result.key, cursor.result.value)
            fragment.appendChild(elemento)
            cursor.result.continue()
        } else document.querySelector(".contenedor-nombres").appendChild(fragment)
    })
}

const modificarObjeto = (key,objeto)=>{
    const IDBData = getIDBData("readwrite")
    IDBData.put(objeto,key)
}

const eliminarObjeto = key =>{
    const IDBData = getIDBData("readwrite")
    IDBData.delete(key)
}

const getIDBData = (modo) =>{
    const db = IDBRequest.result
    const IDBtransaction = db.transaction("nombres",modo)
    const objectStore = IDBtransaction.objectStore("nombres")
    return objectStore
}

const nombresHTML = (id,name) =>{
    const contenedor = document.createElement("DIV")
    const h2 = document.createElement("h2")
    const opciones = document.createElement("DIV")
    const guardarBtn = document.createElement("button")
    const eliminarBtn = document.createElement("button")

    contenedor.classList.add("nombre")
    opciones.classList.add("opciones")
    guardarBtn.classList.add("imposible")
    eliminarBtn.classList.add("eliminar")

    h2.textContent = name.nombre
    h2.setAttribute("contenteditable", "true")
    h2.setAttribute("spellcheck", "false")

    guardarBtn.textContent = "Guardar"
    eliminarBtn.textContent = "Eliminar"

    opciones.appendChild(guardarBtn)
    opciones.appendChild(eliminarBtn)

    contenedor.appendChild(h2)
    contenedor.appendChild(opciones)

    h2.addEventListener("keyup", ()=>{
        guardarBtn.classList.replace("imposible","posible")
    })

    guardarBtn.addEventListener("click", ()=>{
        if (guardarBtn.className == "posible") {
            modificarObjeto(id,{nombre : h2.textContent})
            guardarBtn.classList.replace("posible","imposible")
        }
    })

    eliminarBtn.addEventListener("click", ()=>{
        eliminarObjeto(id)
        leerObjeto()
    })

    return contenedor

}