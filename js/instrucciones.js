$(() => {
	const minimoCaracteres = 0;
	const maximoCaracteres = 30;
	const soloCaracteres = /^[a-z0-9 _]+$/i;
	const elementoLista = $('#lista-de-tareas');	
	const barraProgreso = $('#barra-progreso');
	let listaDeTareas = JSON.parse(localStorage.getItem('lista-de-tareas')) || [];

	function almacenamientoLocalStorage(nuevaTarea) {
		listaDeTareas.push(nuevaTarea);
		const listaActualizada = JSON.stringify(listaDeTareas.filter(Boolean));
		localStorage.setItem('lista-de-tareas', listaActualizada);
	};

	function imprimirDatosAlmacenados() {
		if(listaDeTareas !== null) {
			for(let i = 0; i < listaDeTareas.length; i++) {
				const tarea = listaDeTareas[i];
				elementoLista.append(`<li>
							<button class='btn-editar material-icons'>
								edit
							</button>
			   		  		<span contenteditable='false'> ${tarea} </span>
						      </li>`);
			};
		};
	};

	function activarDecoracion() {
		$('#input-tarea').keyup(function() {
  			const numeroDeCaracteres = $(this).val().length;
			const anchoBarraProgreso = `${numeroDeCaracteres * 3.3}%`
			if(numeroDeCaracteres >= maximoCaracteres) {
				barraProgreso.removeClass('progreso-ok');
				barraProgreso.addClass('progreso-error');
				barraProgreso.css('width', '100%');
			} else {
				barraProgreso.removeClass('progreso-error');
				barraProgreso.addClass('progreso-ok');
				barraProgreso.css('width', anchoBarraProgreso);
			};
		});
	};

	function agregarTarea() {
		$('#btn-agregar').on('click', function() {
			const tareaIngresada = $('#input-tarea').val().trim();		
			if(tareaIngresada.length > minimoCaracteres && tareaIngresada.length <= maximoCaracteres 
			   && tareaIngresada.match(soloCaracteres) && !listaDeTareas.includes(tareaIngresada)) {
						$('#lista-de-tareas').append(`<li>
								<button class='btn-editar material-icons'>
									edit
								</button>
				   	  			<span contenteditable='false' class='tarea'> ${tareaIngresada} </span>
						     	      </li>`);
				$('#input-tarea').val('').hide(200);
				almacenamientoLocalStorage(tareaIngresada);
				barraProgreso.css('width', '0%');
			} else {
				$('#input-tarea').toggle(200).select();	
				barraProgreso.css('width', '0%');
			};
		});
	};

	function editarTarea() {
		$(document).on('click', '.btn-editar', function() {
			const item = $(this).closest('li').find('span');
			let nombreTarea = item.text().trim();
			const posicion = listaDeTareas.indexOf(nombreTarea);
			$(document).off('dblclick');
			$('#btn-agregar, #input-tarea').css('display', 'none');
			$('.btn-editar').hide();
			$('#btn-confirmar-edicion').fadeIn('slow');
			item.prop('contenteditable', true);
			item.removeClass('texto-tachado');
			item.addClass('editor-texto');
			confirmarEdicion(item, nombreTarea, posicion);
			barraProgreso.css('width', '0%');
		});
	};

	function accionesPostEdicion(item) {
		eliminarTarea();
		$('#btn-confirmar-edicion').css('display', 'none');
		$('#btn-agregar').fadeIn('slow');
		$('span').attr('contenteditable', false);
		$('.btn-editar').show();
		item.removeClass('editor-texto');
	};

	function confirmarEdicion(elementoTarea, nombreOriginal, posicion) {
			$('#btn-confirmar-edicion').one('click', function() {
				const item = elementoTarea;
				const nombreTarea = nombreOriginal;
				const nuevoNombre = item.text().trim();
				if(!listaDeTareas.includes(nuevoNombre) && nuevoNombre.length > minimoCaracteres 
			           && nuevoNombre.length < maximoCaracteres && nuevoNombre.match(soloCaracteres)) {
					listaDeTareas[posicion] = nuevoNombre;
					const listaActualizada = JSON.stringify(listaDeTareas);
					localStorage.setItem('lista-de-tareas', listaActualizada);
					item.text(nuevoNombre);
					accionesPostEdicion(item);
				} else {
					item.text(nombreTarea)
					accionesPostEdicion(item);
				};
			});
	};

	function eliminarTarea() {
		$(document).on('dblclick', 'li', function() {
			const item = $(this).closest('li').find('span');
			const elemento = $(this).closest('li');
			const nombreTarea = item.text().trim();
			const posicion = listaDeTareas.indexOf(nombreTarea);
			if(posicion !== -1) {
				listaDeTareas.splice(posicion, 1)
				const listaActualizada = JSON.stringify(listaDeTareas);
				localStorage.setItem('lista-de-tareas', listaActualizada);
			};
			elemento.fadeOut('slow', function() {
				$(this).remove();
			});
		});
	};

	function tacharTarea() {
		$('ul').on('click', 'li', function() {
			const item = $(this).closest('li').find('span');
			if(item.attr('contenteditable') === 'false') {
				item.toggleClass('texto-tachado');		
			};
		});
	};
	
	imprimirDatosAlmacenados();
	agregarTarea();
	editarTarea();
	eliminarTarea();
	activarDecoracion();
	tacharTarea();
});
