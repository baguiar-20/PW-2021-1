(function () {

});

function apagarCurso(){
    $.ajax({
        type: "DELETE",
        url: `/curso/${id}`,
      });
}