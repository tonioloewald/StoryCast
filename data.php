<?php
// database user is storycast
// database password is pegarules!!
$connection = mysql_connect('mysql.doodlegames.com', 'storycast', 'pegarules!!') || die('Connection Failed');

function dump($obj){
    foreach($obj as $key => $val){
        echo "$key: $val<br>";
    }
}

function db_list( $query ){
    $result = mysql_query( $query );
    $rows = array();
    while( $row = mysql_fetch_assoc($result) ){
        $rows []= $row;
    }
    mysql_free_result($result);
    return $rows;
}

function db_one( $query ){
    $result = mysql_query( $query );
    $row = mysql_fetch_assoc($result);
    mysql_free_result($result);
    return $row;
}

function db_result( $query ){
    $result = mysql_query( $query );
    return !!$result;
}

function db_delete( $db, $table, $key, $value ){
    $where = "`$key`='" . filter_var($value, FILTER_SANITIZE_MAGIC_QUOTES) . "'";
    $query = "DELETE FROM `$db`.`$table` WHERE $where;";
    return db_result( $query );
}

function db_get( $db, $table, $key, $value ){
    $where = "`$key`='" . filter_var($value, FILTER_SANITIZE_MAGIC_QUOTES) . "'";
    $query = "SELECT * FROM `$db`.`$table` WHERE $where;";
    return db_list( $query );
}

function db_get_one( $db, $table, $key, $value ){
    $where = "`$key`='" . filter_var($value, FILTER_SANITIZE_MAGIC_QUOTES) . "'";
    $query = "SELECT * FROM `$db`.`$table` WHERE $where;";
    return db_one( $query );
}

function db_count( $db, $table, $key, $value ){
    $where = "`$key`='" . filter_var($value, FILTER_SANITIZE_MAGIC_QUOTES) . "'";
    $query = "SELECT `$key` FROM `$db`.`$table` WHERE $where";
    $result = mysql_query( $query );
    $count = $result ? mysql_num_rows($result) : 0;
    mysql_free_result($result);
    return $count;
}

function db_columns( $db, $table ){
    $query = "SHOW COLUMNS FROM `$table` IN `$db`;";
    return db_list( $query );
}

function db_create( $db, $table, $what ){
    $fields = array();
    $values = array();
    foreach( $what as $key => $value ){
        $fields []= '`' . filter_var($key, FILTER_SANITIZE_MAGIC_QUOTES) . '`';
        $values []= "'" . filter_var($value, FILTER_SANITIZE_MAGIC_QUOTES) . "'";
    }
    $fields = implode(',', $fields);
    $values = implode(',', $values);
    $query = "INSERT INTO `$db`.`$table` ($fields) VALUES ($values);";
    $result = mysql_query($query);
    if( $result ){
        $result = mysql_insert_id();
    }
    return $result;
}

function db_update( $db, $table, $key, $value, $what ){
    $where = "`$key`='" . filter_var($value, FILTER_SANITIZE_MAGIC_QUOTES) . "'";
    $settings = array();
    foreach( $what as $key => $value ){
        $settings []= "`$key`='$value'";
    }
    $settings = implode(',', $settings);
    $query = "UPDATE `$db`.`$table` SET $settings WHERE $where;";
    return !!mysql_query($query);
}

function db_set( $db, $table, $key, $value, $what ){
    $where = "`$key`='" . filter_var($value, FILTER_SANITIZE_MAGIC_QUOTES) . "'";
    if( !db_count($db, $table, $key, $value) ){
        $result = db_create( $db, $table, $what );
    } else {
        $result = db_update( $db, $table, $key, $value, $what );
    }
    return $result;
}
?>