function nav(){
    $('[id]').hide();
    $(window.location.hash || '#login').show();
}

function timestampToDate( stamp ){
    d = new Date(stamp * 1000);
    return d.toLocaleString();
}

function storyList(refresh_only){
    $.json('?story', false, 'GET', function(list){
        $('#story-list table').table(list, {renderDate: timestampToDate});
        if( !refresh_only ){
            window.location = '#story-list';
        }
    });
}

function storyEdit(data){            
    $('#story-edit')[0].reset();
    $('#story-edit').values(data);
    window.location = '#story-edit';
}

function storyDelete(id){
    $.json('?story', {id: id}, 'DELETE', function(){
        storyList();
    });
}

$('#story-detail .edit').on('click', function(e){
    $.json('?story', {id: $('#story-detail [name="id"]')[0].value}, 'GET', function(data){
        storyEdit(data);
    });
});
$('#story-edit').on('submit', function(e){
    this.hide();
    $('#hidden-iframe').on('load', function(e){
        storyList();
    });
})
$('#story-edit .delete').on('click', function(e){
    var id = $('#story-edit [name="id"]')[0].value;
    if( id ){
        storyDelete(id);
    } else {
        storyList();
    }
});
$('.new-story').on('click', function(e){
    $.json('?login', false, 'GET', function(data){
        if( data.id ){
            storyEdit({user_id: data.id});
        } else {
            window.location = '#login';
        }
    });
});
$('#login').on('submit', function(e){
    e.preventDefault();
    $.json('?login', false, "GET", function(data){
        var values = $('#login').values();
        values.password = md5( data.salt + md5( values.password ) );
        $.json('?login', values, 'GET', function(){
            storyList();
        }, function(){
            alert('Login Failed');
        });
    });
});
$('#create-account').on('submit', function(e){
    e.preventDefault();
    $.json('?login', $('#create-account').values(), 'GET', function(){
        window.location = '#login';
    });
});
$('#story-list table tbody').on('mouseup', function(e){
    var tr = e.target.closest('tr'),
        id = tr.querySelector('[name=id]').textContent;
    
    if( !tr ){
        return;
    }
    if( e.target.is('.delete') ){
        storyDelete(id);
    } else if ( e.target.is('.edit') ){
        $.json('?story', {id: id}, 'GET', function(data){
            storyEdit(data);
        });
    } else {
        $.json('?story', {id: id}, 'GET', function(data){
            $('#story-detail').values(data);
            window.location = '#story-detail';
        });
    }
});
storyList(true);
window.on('hashchange', nav);
nav();