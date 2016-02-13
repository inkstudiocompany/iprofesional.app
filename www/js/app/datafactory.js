iproapp.factory('dataFactory', function($http){
	return {
		$scope: null,
		status: 500,
		secciones: [
		],
		data: {

		},
		status: function(seccion){
			var status = (this.secciones.indexOf(seccion) === -1) ? 404 : 200;
			return status;
		},
		setSeccion: function(seccion, content) {
			console.log(this.status(seccion));
			console.log(content);
		},
		setScope: function($scope){
			this.$scope = $scope;
		},
		getScope: function(){
			return this.$scope;
		},
		setContent: function(content){
			this.data = content.data;
			$.each(this.data.seccion.cabezal.notas, function(index, value){
				this.data.seccion[0].cabezal.notas[index] = eval('test.data.noticias.nota_'+value);
			});
			this.status = 200;
		},
		getContent: function(){
			return this.data;
		},
		cabezal: function(){
			return this.data.seccion;
		},
		getSeccion: function(nombre){
			var content = {};
			$.each(this.data.seccion, function(id, seccion){
				if (seccion.nombre == nombre) {
					content = seccion;
					return content;
				}
			});
			return content;
		},
		divisas: function(){
			return this.data.divisas;
		},
		zoom: function(){
			return this.data.zoom;
		},
		masleidas: function(){
			return this.data.masleidas;
		},
		getNota: function(idnoticia) {
			var content = {};
			this.data.noticias.forEach(function(noticia){
				if(noticia.id === idnoticia) {
					content = noticia;
					return content;
				}
			});
			return content;
		},
		Noticias: function() {
			return this.data.noticias;
		}
	};
});