<?php
if( $method == 'GET' ){
    if( !isset($_GET['id']) ){
        $response = array(
            'salt'=> $_SESSION['salt'],
            'id' => $_SESSION['id']
        );
    } else if (!isset($_GET['password'])){
        $id = filter_var($_GET['id'], FILTER_SANITIZE_EMAIL);
        if( $id ){
            $password_new = substr( md5(time()), 0, 8 );
            $password_hash = md5($password_new);
            $result = db_set( 'storycast', 'user', 'id', $id, array( "id" => $id, "password" => $password_hash ) );
            if( $result ){
                mail( $id, 'Storycast', "Your password has been [re]set: $password_new" );
                $response = 204;
            } else {
                $response = 500;
            }
        }
    } else {
        $id = filter_var($_GET['id'], FILTER_SANITIZE_EMAIL);
        $user = db_get_one( 'storycast', 'user', 'id', $id );
        $password_hash = $user['password'];
        $password_submitted = $_GET['password'];
        if( md5( $_SESSION['salt'] . $password_hash ) == $password_submitted ){
            $_SESSION['id'] = $id;
            $response = 204;
        } else {
            echo "hash $password_hash, submitted $password_submitted";
        }
    }
}
?>