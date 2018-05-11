$(document).ready(function(){
    $('.delete-article').on('click',function(e){
    $target =$(e.target);
    const id =$target.attr('data-id');
    console.log(id);
    $.ajax({
        type :'DELETE',
        url :"/article/"+id,
        success : function (response) {
            alert("deleting articles");
            window.location.href='/';
        },
        error : function (error) {
            console.log(error);
        }
    })
    
    })
})