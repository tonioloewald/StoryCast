<?php
if( $method == 'GET' ){
    if( isset($_GET['id']) ){
        $response = db_get_one( 'storycast', 'story', 'id', $_GET['id'] );
    } else {
        $response = db_list( "SELECT id, name, UNIX_TIMESTAMP(last_modified) as last_modified FROM storycast.story ORDER BY last_modified DESC" );
    }
} else if ($method == 'POST'){
    require_once('upload.php');
    $columns = db_columns('storycast', 'story');
    // need to create the record so we know its id
    $response = 500;
    $error = false;
    $record = array();
    if( isset( $_POST['id'] ) && $_POST['id'] ){
        $record['id'] = $_POST['id'];
    } else {
        $record['id'] = db_create( 'storycast', 'story', array('name' => 'untitled') );
    }
    if($record['id']){
        foreach( $columns as $column ){
            $field = $column['Field'];
            if( isset($_FILES[$field]) ){
                $record[$field] = TRUE;
                if( !upload_file( 'uploads', 'storycast', 'story', $field, $record['id'] ) ){
                    $error = true;
                } else {
                    $record[$field] = file_name('uploads', 'storycast', 'story', $field, $record['id'] );
                }
            } else if( $field != 'id' && isset($_POST[$field]) ){
                $record[$field] = $_POST[$field];
            }
        }
        if( !$error && db_update( 'storycast', 'story', 'id', $record['id'], $record ) ){    
            $response = $record;
        }
    }
} else if ($method == 'DELETE'){
    if( isset($_GET['id']) ){
        $id = $_GET['id'];
        if( db_delete('storycast', 'story', id, $id) ){
            require_once('upload.php');
            remove_uploads('uploads', 'storycast', 'story', $id);
        }
        $response = 204;
    }
}
?>