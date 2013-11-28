<?php
function file_name($dir, $db, $table, $field, $id){
    return "{$dir}/{$db}_{$table}_{$field}_{$id}";
}

function upload_file($dir, $db, $table, $field, $id){
    $file = $_FILES[$field];
    $filepath = file_name($dir, $db, $table, $field, $id);
    if($file['error'] != UPLOAD_ERR_OK){
        if( file_exists($filepath) ){
            // we've already got one... it's verrah nice!
            return TRUE;
        } else {
            return FALSE;
        }
    }
    echo( $_FILES[$field]['tmp_name'] . '<br>' );
    echo( $filepath . '<br>' );
    return move_uploaded_file($file['tmp_name'], $filepath);
}

function remove_uploads( $dir, $db, $table, $id ){
    $pattern = "/^{$db}_{$table}_\w+_{$id}$/";
    $d = dir($dir);    
    while (false !== ($entry = $d->read())) {
        $file = "$dir/$entry";
        if( !is_dir($file) && preg_match( $pattern, $entry ) ){
            unlink( $file );
        }
    }
    $d->close();
}
?>
